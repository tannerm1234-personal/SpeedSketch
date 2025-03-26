"use client";

import { useState, useEffect, useRef } from "react";
import GameCanvas from "./game-canvas";
import CountdownTimer from "./countdown-timer";
import GamePrompt from "./game-prompt";
import RecognitionDisplay from "./recognition-display";
import { Button } from "./ui/button";
import { GameResultModal } from "./game-result-modal";

interface GameClientProps {
  userId: string;
  initialPrompt?: string;
}

export default function GameClient({
  userId = "anonymous",
  initialPrompt = "cat",
}: GameClientProps) {
  // Game state
  const [gameState, setGameState] = useState<"idle" | "playing" | "completed">(
    "idle",
  );
  const [currentPrompt, setCurrentPrompt] = useState(initialPrompt);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [predictions, setPredictions] = useState<
    Array<{ className: string; probability: number }>
  >([]);
  const [drawingDataUrl, setDrawingDataUrl] = useState<string | null>(null);

  // Modal state
  const [showResultModal, setShowResultModal] = useState(false);
  const [gameResult, setGameResult] = useState({
    success: false,
    word: "",
    timeRemaining: 0,
    confidenceLevel: 0,
    imageUrl: "",
  });

  // Refs
  const recognitionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start game function
  const startGame = () => {
    setGameState("playing");
    setTimeRemaining(15);
    setPredictions([]);
    setDrawingDataUrl(null);

    // In a real implementation, we would fetch a random prompt from the database
    // For now, we'll use a hardcoded list
    const prompts = [
      "cat",
      "dog",
      "house",
      "tree",
      "car",
      "sun",
      "fish",
      "bird",
      "flower",
      "book",
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(randomPrompt);

    // Start the recognition simulation
    startRecognitionSimulation(randomPrompt);
  };

  // End game function
  const endGame = (success: boolean, confidenceLevel = 0) => {
    setGameState("completed");

    // Stop the recognition interval
    if (recognitionIntervalRef.current) {
      clearInterval(recognitionIntervalRef.current);
      recognitionIntervalRef.current = null;
    }

    // Set the game result
    setGameResult({
      success,
      word: currentPrompt,
      timeRemaining: success ? timeRemaining : 0,
      confidenceLevel,
      imageUrl: drawingDataUrl || "",
    });

    // Show the result modal
    setShowResultModal(true);

    // In a real implementation, we would save the game result to the database
    console.log("Game ended:", {
      userId,
      prompt: currentPrompt,
      success,
      timeRemaining: success ? timeRemaining : 0,
      confidenceLevel,
    });
  };

  // Timer complete handler
  const handleTimerComplete = () => {
    if (gameState === "playing") {
      endGame(false);
    }
  };

  // Save drawing handler
  const handleSaveDrawing = (dataUrl: string) => {
    setDrawingDataUrl(dataUrl);
  };

  // This is a simulation of the TensorFlow.js recognition
  // In a real implementation, we would use TensorFlow.js to analyze the drawing
  const startRecognitionSimulation = (targetWord: string) => {
    // Clear any existing interval
    if (recognitionIntervalRef.current) {
      clearInterval(recognitionIntervalRef.current);
    }

    // Set up variables for the simulation
    let recognitionAttempts = 0;
    const maxAttempts = 15; // One per second
    const targetConfidence = 0.9; // 90% confidence required to win

    // Start the recognition interval
    recognitionIntervalRef.current = setInterval(() => {
      recognitionAttempts++;

      // Simulate increasing confidence over time
      // In a real implementation, this would be the result of TensorFlow.js analysis
      const baseConfidence = Math.min(0.3 + recognitionAttempts * 0.05, 0.95);

      // Add some randomness
      const confidence = baseConfidence * (0.9 + Math.random() * 0.2);

      // Generate some fake predictions
      const fakePredictions = [
        { className: targetWord, probability: confidence },
        {
          className: getRandomWord(targetWord),
          probability: Math.max(0.1, (1 - confidence) * 0.7),
        },
        {
          className: getRandomWord(targetWord),
          probability: Math.max(0.05, (1 - confidence) * 0.3),
        },
      ];

      // Update the predictions state
      setPredictions(fakePredictions);

      // Check if the confidence is high enough to win
      if (confidence >= targetConfidence) {
        endGame(true, confidence);
      }

      // If we've reached the maximum number of attempts, end the game
      if (recognitionAttempts >= maxAttempts && gameState === "playing") {
        endGame(false);
      }
    }, 1000);
  };

  // Helper function to get a random word that's not the target word
  const getRandomWord = (excludeWord: string) => {
    const words = [
      "cat",
      "dog",
      "house",
      "tree",
      "car",
      "sun",
      "fish",
      "bird",
      "flower",
      "book",
      "chair",
      "table",
    ];
    const filteredWords = words.filter((word) => word !== excludeWord);
    return filteredWords[Math.floor(Math.random() * filteredWords.length)];
  };

  // Clean up the interval on unmount
  useEffect(() => {
    return () => {
      if (recognitionIntervalRef.current) {
        clearInterval(recognitionIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Left column - Timer */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-lg font-medium mb-4">Time Remaining</h2>
          <CountdownTimer
            duration={15}
            isRunning={gameState === "playing"}
            onComplete={handleTimerComplete}
            size="lg"
          />
        </div>

        {/* Middle column - Prompt */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-lg font-medium mb-4">Draw This</h2>
          <GamePrompt
            prompt={currentPrompt}
            isVisible={gameState === "playing"}
          />
          {gameState === "idle" && (
            <Button
              onClick={startGame}
              className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Start Game
            </Button>
          )}
          {gameState === "completed" && (
            <Button
              onClick={startGame}
              className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Play Again
            </Button>
          )}
        </div>

        {/* Right column - Recognition */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-lg font-medium mb-4">AI Recognition</h2>
          <RecognitionDisplay predictions={predictions} />
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <GameCanvas
          isActive={gameState === "playing"}
          onSave={handleSaveDrawing}
        />
      </div>

      {/* Result Modal */}
      <GameResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        result={gameResult}
      />
    </div>
  );
}
