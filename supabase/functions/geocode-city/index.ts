import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cityName, country } = await req.json();
    
    if (!cityName) {
      return new Response(
        JSON.stringify({ error: 'City name is required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const mapboxToken = Deno.env.get('MAPBOX_ACCESS_TOKEN');
    if (!mapboxToken) {
      console.error('MAPBOX_ACCESS_TOKEN not found');
      return new Response(
        JSON.stringify({ error: 'Mapbox token not configured' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build search query - include country if provided for better accuracy
    const searchQuery = country ? `${cityName}, ${country}` : cityName;
    const encodedQuery = encodeURIComponent(searchQuery);
    
    const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?access_token=${mapboxToken}&types=place&limit=1`;
    
    console.log(`Geocoding request for: ${searchQuery}`);
    
    const response = await fetch(mapboxUrl);
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Mapbox API error:', data);
      return new Response(
        JSON.stringify({ error: 'Failed to geocode city' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const [longitude, latitude] = feature.center;
      
      console.log(`Found coordinates for ${searchQuery}: ${latitude}, ${longitude}`);
      
      return new Response(
        JSON.stringify({
          latitude: parseFloat(latitude.toFixed(6)),
          longitude: parseFloat(longitude.toFixed(6)),
          placeName: feature.place_name
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.log(`No results found for: ${searchQuery}`);
      return new Response(
        JSON.stringify({ error: 'No coordinates found for this city' }), 
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in geocode-city function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})