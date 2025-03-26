import { NextResponse } from "next/server";

// Mock AI recognition function
// In a real implementation, this would call Google Cloud Vision API or similar
function recognizeDrawing(
  imageData: string,
): Promise<{ className: string; probability: number }[]> {
  // List of possible objects
  const objects = ["cat", "dog", "tree", "car", "moon"];

  // For demo purposes, we'll return random results
  // In a real implementation, this would analyze the image
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate 3 random guesses with different probabilities
      const results = objects
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((obj) => ({
          className: obj,
          // Ensure we have a reasonable probability range (0.5-1.0) for better guessing
          probability: 0.5 + Math.random() * 0.5,
        }))
        .sort((a, b) => b.probability - a.probability);

      resolve(results);
    }, 300); // Reduced API delay for faster feedback
  });
}

export async function POST(request: Request) {
  try {
    const { imageData } = await request.json();

    if (!imageData) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 },
      );
    }

    // Call recognition function
    const predictions = await recognizeDrawing(imageData);

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error("Error in recognition API:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 },
    );
  }
}
