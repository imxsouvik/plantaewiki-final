import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: `Analyze this plant and predict its growth. Return ONLY valid JSON:
{
  "plantName": "string",
  "currentHeight": "estimated current height",
  "estimatedHeight": "max height at maturity",
  "leafSpread": "expected spread",
  "survivalProbability": number between 0-100,
  "growthTimeline": [
    { "phase": "Seedling", "duration": "timeframe", "description": "brief" },
    { "phase": "Vegetative", "duration": "timeframe", "description": "brief" },
    { "phase": "Mature", "duration": "timeframe", "description": "brief" }
  ],
  "recommendations": ["tip1", "tip2", "tip3"]
}` },
              { type: 'image_url', image_url: { url: image } }
            ]
          }
        ],
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Failed to parse' };

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: unknown) {
    console.error('Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
