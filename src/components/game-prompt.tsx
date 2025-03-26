"use client";

import { useState, useEffect } from "react";

interface GamePromptProps {
  word: string;
  isRevealed?: boolean;
}

export default function GamePrompt({
  word,
  isRevealed = false,
}: GamePromptProps) {
  const [displayWord, setDisplayWord] = useState("");

  useEffect(() => {
    if (isRevealed) {
      setDisplayWord(word);
    } else {
      // Show only the length of the word with underscores
      setDisplayWord("_".repeat(word.length));
    }
  }, [word, isRevealed]);

  return (
    <div className="text-center p-2 bg-white rounded-lg shadow-sm border border-gray-200 w-full">
      <h2 className="text-xl font-bold tracking-wide uppercase text-blue-600">
        {displayWord || ""}
      </h2>
    </div>
  );
}
