import { createClient } from "../../../../supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { imageData, object, time, confidence } = await request.json();

    if (!imageData || !object) {
      return NextResponse.json(
        { error: "Image data and object are required" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Convert base64 to buffer
    const base64Data = imageData.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    // Generate a unique filename
    const filename = `${object}-${Date.now()}.png`;

    // Upload image to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from("sketches")
      .upload(filename, buffer, {
        contentType: "image/png",
        upsert: false,
      });

    if (storageError) {
      console.error("Storage error:", storageError);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 },
      );
    }

    // Get public URL for the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from("sketches")
      .getPublicUrl(filename);

    const imageUrl = publicUrlData.publicUrl;

    // Save sketch metadata to database
    const { data: sketchData, error: dbError } = await supabase
      .from("sketches")
      .insert([
        {
          object_name: object,
          time_seconds: time,
          confidence: confidence,
          image_url: imageUrl,
        },
      ])
      .select();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save sketch data" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      sketch: sketchData[0],
      imageUrl,
    });
  } catch (error) {
    console.error("Error in save sketch API:", error);
    return NextResponse.json(
      { error: "Failed to save sketch" },
      { status: 500 },
    );
  }
}
