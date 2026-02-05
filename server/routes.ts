import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import { insertUserSchema, insertBookingSchema } from "@shared/schema";

const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;

const systemPrompt = `You are the AI Assistant for Buwate Tennis Club (BTC), a premier tennis club located in Buwate, Kampala, Uganda. You help members and visitors with booking courts, understanding pricing, membership information, and club rules.

## Club Information

**Location:** Buwate, Kampala, Uganda
**Contact:** 
- Phone: +256 772 675 050, +256 772 367 7325
- Email: btc2023@gmail.com
**Operating Hours:** 8:00 AM - 10:00 PM daily

## Facilities
- 2 professional clay courts
- Floodlights for evening play
- 2 independent contractor coaches available

## Playing Rates (Per Hour)
- Club Members: UGX 10,000/hour
- Club Members' Children: UGX 5,000/hour
- Non-Members: UGX 15,000/hour
- Non-Members' Children: UGX 10,000/hour

## Monthly Packages
- Club Members: UGX 150,000/month (unlimited play)
- Non-Members: UGX 200,000/month (unlimited play)

## Membership
- Annual Membership Fee: UGX 100,000 (one-time)
- Monthly Subscription: UGX 20,000/month
- Benefits include: discounted rates, priority booking, tournament access, member events

## Booking Rules
- Book at least 24 hours in advance
- Maximum booking: 1 hour per session
- Cancellation: at least 2 hours before your slot
- Prime Time: 8 AM - 12 PM and 3 PM - 6 PM
- Off-Peak: 12 PM - 3 PM and 6 PM - 10 PM

## Club Rules
- Pay via MoMo ONLY (0790229161 - Brian Isubikalu). Cash NOT accepted.
- No animals, pets, or toys inside the fenced court area
- No smoking within the fenced court area
- No vulgar language or aggressive behavior
- Only racquets, tennis balls, and players on the clay courts
- Violations may result in a ban

## Your Behavior
- Be friendly, helpful, and professional
- Provide accurate information about the club
- Help users understand booking process
- Answer questions about membership benefits
- Explain club rules clearly
- If asked about something you don't know, suggest contacting the club directly
- Keep responses concise but informative
- Use UGX for all prices (Ugandan Shillings)`;

export function registerRoutes(app: Express): void {
  // Health check (for load balancers and monitoring)
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Auth routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0].message });
      }

      const { email, password, fullName } = result.data;

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        fullName: fullName || null,
      });

      const { password: _, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Store user in session
      (req.session as any).userId = user.id;

      const { password: _, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser });
  });

  // Bookings routes
  app.get("/api/bookings", async (req: Request, res: Response) => {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const bookings = await storage.getBookingsByUserId(userId);
    res.json(bookings);
  });

  app.post("/api/bookings", async (req: Request, res: Response) => {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const result = insertBookingSchema.safeParse({ ...req.body, userId });
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors[0].message });
      }

      const booking = await storage.createBooking(result.data);
      res.json(booking);
    } catch (error) {
      console.error("Booking error:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.delete("/api/bookings/:id", async (req: Request, res: Response) => {
    const userId = (req.session as any)?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid booking id" });
    }

    try {
      const deleted = await storage.deleteBooking(id, userId);
      if (!deleted) {
        return res.status(404).json({ error: "Booking not found or access denied" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Cancel booking error:", error);
      res.status(500).json({ error: "Failed to cancel booking" });
    }
  });

  // AI Assistant route (migrated from Supabase edge function)
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { messages } = req.body;

      if (!LOVABLE_API_KEY) {
        return res.status(500).json({ error: "LOVABLE_API_KEY is not configured" });
      }

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return res.status(429).json({ error: "Rate limits exceeded, please try again later." });
        }
        if (response.status === 402) {
          return res.status(402).json({ error: "Service temporarily unavailable." });
        }
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        return res.status(500).json({ error: "AI gateway error" });
      }

      // Stream the response
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const reader = response.body?.getReader();
      if (!reader) {
        return res.status(500).json({ error: "No response body" });
      }

      const decoder = new TextDecoder();
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          res.write(chunk);
        }
      } finally {
        reader.releaseLock();
      }

      res.end();
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  });
}
