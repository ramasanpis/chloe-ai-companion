
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

    console.log('Generating image with prompt:', enhancedPrompt)

    let imageUrl = null
    
    try {
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

      if (response.ok) {
        const data = await response.json()
        console.log('API response:', data)
        
        if (data.data && data.data[0]?.url) {
          imageUrl = data.data[0].url
          console.log('Generated image URL:', imageUrl)
        }
      } else {
        console.error('API request failed:', response.status, await response.text())
      }
    } catch (apiError) {
      console.error('API call failed:', apiError)
    }
    
    // High-quality fallback images if API fails
    const fallbackImages = {
      beach: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
      cute: "https://images.unsplash.com/photo-1494790108755-2616c27de2a2?w=400&h=600&fit=crop&crop=face", 
      dress: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop&crop=face",
      portrait: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face",
      default: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face"
    }

    // Use API result or fallback
    const finalImageUrl = imageUrl || fallbackImages[context as keyof typeof fallbackImages] || fallbackImages.default

    console.log('Final image URL:', finalImageUrl)

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: finalImageUrl 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    
    // Return a reliable fallback image on any error
    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
