import { NextResponse } from "next/server";

// Mock AI recognition function
// In a real implementation, this would call Google Cloud Vision API or similar
function recognizeDrawing(
  imageData: string,
  targetWord?: string,
): Promise<{ className: string; probability: number }[]> {
  // List of possible objects
  const objects = [
    "cat",
    "dog",
    "tree",
    "car",
    "moon",
    "bicycle",
    "house",
    "sun",
    "fish",
    "bird",
    "flower",
    "book",
    "chair",
    "table",
    "airplane",
    "mountain",
    "river",
    "pizza",
    "apple",
    "banana",
    "guitar",
  ];

  // For demo purposes, we'll simulate more realistic recognition
  return new Promise((resolve) => {
    setTimeout(() => {
      // If we have a target word, make it more likely to appear in results
      let results = [];

      // Always include the target word with a probability that increases over time
      // This simulates the AI getting better at recognizing the drawing as it progresses
      if (targetWord) {
        // Random probability but weighted to sometimes be high
        const targetProb =
          Math.random() < 0.3
            ? 0.7 + Math.random() * 0.3 // 30% chance of high probability
            : 0.3 + Math.random() * 0.4; // 70% chance of medium-low probability

        results.push({
          className: targetWord,
          probability: targetProb,
        });
      }

      // Add some random guesses
      const filteredObjects = objects.filter((obj) => obj !== targetWord);
      const randomObjects = filteredObjects
        .sort(() => Math.random() - 0.5)
        .slice(0, 2);

      randomObjects.forEach((obj) => {
        results.push({
          className: obj,
          probability: 0.2 + Math.random() * 0.5,
        });
      });

      // Sort by probability
      results = results.sort((a, b) => b.probability - a.probability);

      resolve(results);
    }, 300); // Reduced API delay for faster feedback
  });
}

export async function POST(request: Request) {
  try {
    const { imageData, targetWord } = await request.json();

    if (!imageData) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 },
      );
    }

    // Call recognition function with target word if provided
    const predictions = await recognizeDrawing(imageData, targetWord);

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error("Error in recognition API:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 },
    );
  }
}
