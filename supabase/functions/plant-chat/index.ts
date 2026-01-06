import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history } = await req.json();
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

    const systemPrompt = `You are PlantWise Assistant, a friendly and knowledgeable plant expert. You help users with:
- Plant care tips and advice
- Identifying plant problems
- General gardening questions
- Information about different plant species
- How to use the PlantWise website features

Keep responses concise, helpful, and friendly. If asked about something outside plants or the website, politely redirect to plant-related topics.`;

    // Build the conversation for Gemini
    const contents = [];
    
    // Add system instruction as first user message
    contents.push({
      role: "user",
      parts: [{ text: systemPrompt }]
    });
    contents.push({
      role: "model",
      parts: [{ text: "Understood! I'm PlantWise Assistant, ready to help with all your plant-related questions. How can I assist you today?" }]
    });

    // Add conversation history
    for (const m of history) {
      contents.push({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      });
    }

    // Add the current message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    console.log("Calling Gemini API with message:", message);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Gemini response:", JSON.stringify(data));

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                  "I'm sorry, I couldn't understand that. Please try again.";

    return new Response(JSON.stringify({ response: reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Chat error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
