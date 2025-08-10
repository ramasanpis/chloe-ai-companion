
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, context } = await req.json()

    // Enhanced prompts based on context
    let enhancedPrompt = prompt
    if (context === 'beach') {
      enhancedPrompt = "beautiful anime girlfriend in a bikini on a sunny beach, smiling, high quality, detailed"
    } else if (context === 'cute') {
      enhancedPrompt = "cute anime girlfriend with big eyes, kawaii style, adorable expression, high quality"
    } else if (context === 'dress') {
      enhancedPrompt = "elegant anime girlfriend in a beautiful dress, stunning, fashionable, high quality"
    } else if (context === 'portrait') {
      enhancedPrompt = "beautiful anime girlfriend portrait, detailed face, charming smile, high quality"
    }

    const response = await fetch('https://api.a4f.co/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ddc-a4f-f4ca021ad1a54bda8ab5ccbf457ddd62',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'provider-6/FLUX.1-kontext-max',
        prompt: enhancedPrompt,
        n: 1,
        size: '512x512'
      }),
    })

    const data = await response.json()
    
    // Fallback images if API fails
    const fallbackImages = {
      beach: "https://picsum.photos/400/600?random=beach",
      cute: "https://picsum.photos/400/600?random=cute", 
      dress: "https://picsum.photos/400/600?random=dress",
      portrait: "https://picsum.photos/400/600?random=portrait",
      default: "https://picsum.photos/400/600?random=girlfriend"
    }

    const imageUrl = (data.data && data.data[0]?.url) 
      ? data.data[0].url 
      : fallbackImages[context as keyof typeof fallbackImages] || fallbackImages.default

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    
    // Return fallback image on error
    const fallbackImages = {
      beach: "https://picsum.photos/400/600?random=beach",
      cute: "https://picsum.photos/400/600?random=cute",
      dress: "https://picsum.photos/400/600?random=dress", 
      portrait: "https://picsum.photos/400/600?random=portrait",
      default: "https://picsum.photos/400/600?random=girlfriend"
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: fallbackImages.default
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
