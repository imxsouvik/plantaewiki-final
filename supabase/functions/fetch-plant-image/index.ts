import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function fetchWikipediaImage(plantName: string): Promise<string | null> {
  try {
    console.log(`Fetching Wikipedia image for: ${plantName}`);
    
    // Try with exact name first
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(plantName)}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'PlantaeWiki/1.0 (https://plantaewiki.com; contact@plantaewiki.com)',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const imageUrl = data.originalimage?.source || data.thumbnail?.source || null;
      if (imageUrl) {
        console.log(`Found Wikipedia image: ${imageUrl}`);
        return imageUrl;
      }
    }

    // Try with underscore format
    const altSearchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(plantName.replace(/ /g, '_'))}`;
    const altResponse = await fetch(altSearchUrl, {
      headers: {
        'User-Agent': 'PlantaeWiki/1.0 (https://plantaewiki.com; contact@plantaewiki.com)',
      },
    });

    if (altResponse.ok) {
      const altData = await altResponse.json();
      const imageUrl = altData.originalimage?.source || altData.thumbnail?.source || null;
      if (imageUrl) {
        console.log(`Found Wikipedia image (alt): ${imageUrl}`);
        return imageUrl;
      }
    }

    return null;
  } catch (error) {
    console.error('Wikipedia fetch error:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { plantName } = await req.json();
    
    if (!plantName) {
      return new Response(
        JSON.stringify({ error: 'Plant name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Searching for image of: ${plantName}`);

    // Try multiple sources in order of preference
    let imageUrl: string | null = null;

    // 1. Try Wikipedia first (best quality, most reliable for scientific names)
    imageUrl = await fetchWikipediaImage(plantName);
    
    // 2. Try with just common name if scientific name didn't work
    if (!imageUrl && plantName.includes(' ')) {
      const commonName = plantName.split(' ')[0];
      console.log(`Trying with simplified name: ${commonName}`);
      imageUrl = await fetchWikipediaImage(commonName);
    }

    console.log(`Final image URL: ${imageUrl || 'Not found'}`);

    return new Response(
      JSON.stringify({ imageUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error fetching plant image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
