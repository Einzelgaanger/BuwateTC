import { createRequire } from "module";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { pool } from "./db";

const require = createRequire(import.meta.url);
const connectPgSimple = require("connect-pg-simple")(session);

const isProduction = process.env.NODE_ENV === "production";

// Production: require strong session secret (no default)
if (isProduction && !process.env.SESSION_SECRET) {
  throw new Error(
    "SESSION_SECRET must be set in production. Use a long random string (e.g. openssl rand -base64 32)"
  );
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session configuration (persistent store in DB for production-ready deployments)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "btc-session-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: new connectPgSimple({
      pool,
      createTableIfMissing: true,
    }),
    cookie: {
      secure: isProduction,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "lax",
    },
  })
);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    if (isProduction) {
      log(`Error ${status}: ${message}`, "express");
    } else {
      console.error(err);
    }
    res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app);
  } else {
    serveStatic(app);
  }

  const port = Number(process.env.PORT) || 5000;
  app.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port} (${isProduction ? "production" : "development"})`);
  });
})();
