import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.5";
import { v4 as uuidv4 } from "https://esm.sh/uuid@9.0.1";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { image, sessionId } = await req.json();

    if (!image || !sessionId) {
      return new Response(JSON.stringify({ error: "Missing image or sessionId" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Convert base64 to ArrayBuffer
    const imageBuffer = await fetch(image).then((res) => res.arrayBuffer());
    const fileExtension = image.substring("data:image/".length, image.indexOf(";base64"));
    const fileName = `mobile-uploads/${sessionId}/${uuidv4()}.${fileExtension}`;

    // Upload image to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("mobile-uploads") // Assume a bucket named 'mobile-uploads' exists
      .upload(fileName, imageBuffer, {
        contentType: `image/${fileExtension}`,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return new Response(JSON.stringify({ error: uploadError.message }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Get public URL of the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from("mobile-uploads")
      .getPublicUrl(fileName);

    const imageUrl = publicUrlData.publicUrl;

    // Insert into 'mobile_uploads' table
    const { error: dbError } = await supabase
      .from("mobile_uploads") // Assume a table named 'mobile_uploads' exists
      .insert([{ session_id: sessionId, image_url: imageUrl, created_at: new Date().toISOString() }]);

    if (dbError) {
      console.error("Database insert error:", dbError);
      return new Response(JSON.stringify({ error: dbError.message }), {
        headers: { "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: "Image uploaded successfully", imageUrl }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Request handling error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
