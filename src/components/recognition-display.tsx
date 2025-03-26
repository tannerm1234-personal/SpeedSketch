"use client";

import { useState, useEffect } from "react";

interface Prediction {
  className: string;
  probability: number;
}

interface RecognitionDisplayProps {
  predictions: Prediction[];
  threshold?: number;
  maxItems?: number;
}

export default function RecognitionDisplay({
  predictions = [],
  threshold = 0.1, // 10% minimum confidence to display
  maxItems = 3,
}: RecognitionDisplayProps) {
  const [sortedPredictions, setSortedPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    // Sort predictions by probability and filter by threshold
    const filtered = [...predictions]
      .filter((pred) => pred.probability >= threshold)
      .sort((a, b) => b.probability - a.probability)
      .slice(0, maxItems);

    setSortedPredictions(filtered);
  }, [predictions, threshold, maxItems]);

  // If no predictions above threshold
  if (sortedPredictions.length === 0) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-500 text-sm">AI is thinking...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <p className="text-sm text-gray-500 mb-2">AI thinks it's:</p>
      <ul className="space-y-2">
        {sortedPredictions.map((prediction, index) => {
          // Determine color based on confidence
          const confidenceColor =
            prediction.probability >= 0.9
              ? "text-green-600"
              : prediction.probability >= 0.7
                ? "text-blue-600"
                : prediction.probability >= 0.5
                  ? "text-yellow-600"
                  : "text-gray-600";

          return (
            <li key={index} className="flex justify-between items-center">
              <span className={`font-medium ${confidenceColor}`}>
                {prediction.className}
              </span>
              <span className="text-sm bg-gray-200 px-2 py-1 rounded-full">
                {Math.round(prediction.probability * 100)}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
