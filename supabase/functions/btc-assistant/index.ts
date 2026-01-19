import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("btc-assistant error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
