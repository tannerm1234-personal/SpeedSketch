"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import GameCanvas from "./game-canvas";
import GamePrompt from "./game-prompt";
import RecognitionDisplay from "./recognition-display";
import { Button } from "./ui/button";
import { GameResultModal } from "./game-result-modal";

// Objects will be fetched from the API

export default function SinglePageGame() {
  // Game state
  const [gameState, setGameState] = useState<
    "idle" | "countdown" | "playing" | "completed"
  >("idle");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [countdownValue, setCountdownValue] = useState(3);
  const [predictions, setPredictions] = useState<
    Array<{ className: string; probability: number }>
  >([]);
  const [drawingDataUrl, setDrawingDataUrl] = useState<string | null>(null);
  const [isFirstDraw, setIsFirstDraw] = useState(true);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);

  // Modal state
  const [showResultModal, setShowResultModal] = useState(false);
  const [showShareButton, setShowShareButton] = useState(false);
  const [gameResult, setGameResult] = useState({
    success: false,
    word: "",
    timeElapsed: 0,
    confidenceLevel: 0,
    imageUrl: "",
    rating: 0,
  });

  // Refs
  const recognitionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const maxTimeRef = useRef<number>(60); // 60 seconds max time

  // Track top time
  const [topTime, setTopTime] = useState<number | null>(null);

  // Track artists count
  const [artistCount, setArtistCount] = useState<number>(78);

  // Fetch top time and artist count
  useEffect(() => {
    const fetchTopTime = async () => {
      try {
        const response = await fetch("/api/top-time");
        if (response.ok) {
          const data = await response.json();
          if (data.topTime) {
            setTopTime(data.topTime);
          }
        }
      } catch (error) {
        console.error("Error fetching top time:", error);
      }
    };

    const fetchArtistCount = async () => {
      try {
        const response = await fetch("/api/recent-sketches");
        if (response.ok) {
          const data = await response.json();
          if (data.todaysArtists) {
            setArtistCount(data.todaysArtists);
          }
        }
      } catch (error) {
        console.error("Error fetching artist count:", error);
      }
    };

    fetchTopTime();
    fetchArtistCount();
  }, []);

  // Check if user has played today - commented out for testing
  /*useEffect(() => {
    const lastPlayed = localStorage.getItem("lastPlayedDate");
    const today = new Date().toDateString();

    if (lastPlayed === today) {
      setHasPlayedToday(true);
    }
  }, []);*/

  // Fetch daily prompt
  const fetchDailyPrompt = async () => {
    try {
      const response = await fetch("/api/daily-prompt");
      if (response.ok) {
        const data = await response.json();
        if (data.prompt && data.prompt.word) {
          setCurrentPrompt(data.prompt.word.toLowerCase());
          return data.prompt.word.toLowerCase();
        }
      }
      // Fallback to a default word if API fails
      return "cat";
    } catch (error) {
      console.error("Error fetching daily prompt:", error);
      return "cat";
    }
  };

  // Start game function
  const startGame = async () => {
    // Check if already played today - commented out for testing
    /*const today = new Date().toDateString();
    const lastPlayed = localStorage.getItem("lastPlayedDate");

    if (lastPlayed === today) {
      setHasPlayedToday(true);
      return;
    }*/

    // Reset state
    setGameState("countdown");
    setCountdownValue(3);
    setPredictions([]);
    setDrawingDataUrl(null);
    setIsFirstDraw(true);
    setTimeElapsed(0);

    // Fetch the daily prompt
    const prompt = await fetchDailyPrompt();
    setCurrentPrompt(prompt);

    // Start countdown
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    countdownIntervalRef.current = setInterval(() => {
      setCountdownValue((prev) => {
        if (prev <= 1) {
          // Countdown complete, start the game
          clearInterval(countdownIntervalRef.current!);
          setGameState("playing");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start timer as soon as the prompt loads
  useEffect(() => {
    if (gameState === "playing" && currentPrompt) {
      // Start the timer
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      timerIntervalRef.current = setInterval(() => {
        setTimeElapsed((prev) => {
          const newTime = prev + 0.1;
          // Check if time exceeded max time
          if (newTime >= maxTimeRef.current) {
            endGame(false);
            return maxTimeRef.current;
          }
          return newTime;
        });
      }, 100);

      // Start recognition interval
      startRecognitionInterval();
    }
  }, [gameState, currentPrompt]);

  // Handle drawing start
  const handleDrawStart = () => {
    if (gameState === "playing" && isFirstDraw) {
      setIsFirstDraw(false);
    }
  };

  // Start recognition interval
  const startRecognitionInterval = () => {
    if (recognitionIntervalRef.current) {
      clearInterval(recognitionIntervalRef.current);
    }

    recognitionIntervalRef.current = setInterval(async () => {
      if (!drawingDataUrl) return;

      try {
        const response = await fetch("/api/recognize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageData: drawingDataUrl }),
        });

        if (!response.ok) throw new Error("Recognition failed");

        const data = await response.json();
        setPredictions(data.predictions || []);

        // Check if the correct object is recognized with high confidence
        const correctPrediction = data.predictions?.find(
          (p: any) => p.className === currentPrompt && p.probability >= 0.9,
        );

        if (correctPrediction) {
          // Success! The AI recognized the drawing
          endGame(true, correctPrediction.probability);
        }
      } catch (error) {
        console.error("Error in recognition:", error);
      }
    }, 1000); // Check every second
  };

  // Generate a rating based on drawing quality factors
  const generateRating = (
    confidenceLevel: number,
    timeElapsed: number,
  ): number => {
    // Base rating on confidence level (0.7-1.0) and time taken
    // Higher confidence and lower time = better rating
    let rating = 0;

    // Confidence factor (0-3 stars)
    const confidenceFactor =
      confidenceLevel >= 0.95
        ? 3
        : confidenceLevel >= 0.85
          ? 2
          : confidenceLevel >= 0.75
            ? 1
            : 0;

    // Time factor (0-2 stars)
    // Faster times get more stars (under 10s is excellent)
    const timeFactor = timeElapsed <= 10 ? 2 : timeElapsed <= 20 ? 1 : 0;

    // Combine factors with a minimum of 1 star for success
    rating = Math.max(1, confidenceFactor + timeFactor);

    return rating;
  };

  // End game function
  const endGame = async (success: boolean, confidenceLevel = 0) => {
    setGameState("completed");

    // Mark as played today - commented out for testing
    /*const today = new Date().toDateString();
    localStorage.setItem("lastPlayedDate", today);
    setHasPlayedToday(true);*/

    // Stop all intervals
    if (recognitionIntervalRef.current) {
      clearInterval(recognitionIntervalRef.current);
      recognitionIntervalRef.current = null;
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (success && drawingDataUrl) {
      // Save the drawing to Supabase
      try {
        const response = await fetch("/api/save-sketch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageData: drawingDataUrl,
            object: currentPrompt,
            time: timeElapsed,
            confidence: confidenceLevel,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Generate a rating for the drawing
          const rating = success
            ? generateRating(confidenceLevel, timeElapsed)
            : 0;

          // Set the game result with the saved image URL and rating
          setGameResult({
            success,
            word: currentPrompt,
            timeElapsed: timeElapsed,
            confidenceLevel,
            imageUrl: data.imageUrl || drawingDataUrl,
            rating,
          });
        } else {
          throw new Error("Failed to save sketch");
        }
      } catch (error) {
        console.error("Error saving sketch:", error);
        // Generate a rating for the drawing
        const rating = success
          ? generateRating(confidenceLevel, timeElapsed)
          : 0;

        // Still show the result modal even if saving fails
        setGameResult({
          success,
          word: currentPrompt,
          timeElapsed: timeElapsed,
          confidenceLevel,
          imageUrl: drawingDataUrl,
          rating,
        });
      }
    } else {
      // Generate a rating for the drawing
      const rating = success ? generateRating(confidenceLevel, timeElapsed) : 0;

      // Set the game result without saving
      setGameResult({
        success,
        word: currentPrompt,
        timeElapsed: success ? timeElapsed : 0,
        confidenceLevel,
        imageUrl: drawingDataUrl || "",
        rating,
      });
    }

    // Show the result modal and enable share button on homepage
    setShowResultModal(true);
    if (success) {
      setShowShareButton(true);
    }
  };

  // Save drawing handler
  const handleSaveDrawing = (dataUrl: string) => {
    setDrawingDataUrl(dataUrl);
  };

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (recognitionIntervalRef.current) {
        clearInterval(recognitionIntervalRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Fetch recent sketches for the community reel
  const [communityDrawings, setCommunityDrawings] = useState<any[]>([]);

  useEffect(() => {
    const fetchCommunityDrawings = async () => {
      try {
        const response = await fetch("/api/recent-sketches");
        if (response.ok) {
          const data = await response.json();
          setCommunityDrawings(data.sketches || []);
        }
      } catch (error) {
        console.error("Error fetching community drawings:", error);
      }
    };

    fetchCommunityDrawings();
  }, []);

  return (
    <div className="w-[90%] max-w-5xl mx-auto px-4 py-4 bg-white">
      <div className="w-full h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-4"></div>
      <div className="rounded-xl shadow-md p-5 mb-6 text-center relative bg-white">
        <h1 className="text-3xl font-bold mb-2">SpeedSketch</h1>
        <p className="text-gray-700 text-sm font-bold mb-2">
          Draw fast! Can you beat today's best time?
        </p>
        <p className="text-gray-600 text-xs mt-2 w-full mx-auto">
          Draw the Daily Object QUICK! The A.I. will be guessing your artist
          skills the entire time.
          <br />
          Get a fast time, rub it in your friends' faces how much better of an
          artist you are! Can you beat today's best time?
        </p>

        {/* Share button that appears after successful drawing */}
        {showShareButton && (
          <button
            onClick={() => setShowResultModal(true)}
            className="absolute top-4 right-4 bg-purple-500 hover:bg-purple-600 text-white rounded-full p-2 shadow-md transition-all"
            aria-label="Share your drawing"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
          </button>
        )}
      </div>

      {/* Game container with improved styling */}
      <div className="rounded-xl shadow-md p-5 mb-6 bg-white">
        {/* Today's Stats */}
        <div className="mb-4 text-center">
          <div className="inline-flex gap-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Today's Top Time:{" "}
              </span>
              <span className="text-sm font-bold text-red-600">
                {topTime ? `${topTime.toFixed(1)}s` : "14.2s"}
              </span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Today's Artists:{" "}
              </span>
              <span className="text-sm font-bold text-blue-600">
                78 artists
              </span>
            </div>
          </div>
        </div>

        {/* Canvas with improved styling */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 p-0 border border-gray-200 w-full">
          <GameCanvas
            isActive={gameState === "playing"}
            onSave={handleSaveDrawing}
            onDrawStart={handleDrawStart}
          />
        </div>

        {/* Controls with buttons side by side */}
        <div className="flex justify-center items-center gap-4 mb-4">
          {gameState !== "countdown" ? (
            <>
              <Button
                onClick={startGame}
                // disabled={gameState === "countdown" || hasPlayedToday} // Daily limit commented out for testing
                disabled={gameState === "countdown"}
                className="px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-lg text-sm font-medium shadow-sm transition-all"
              >
                {gameState === "idle" ? "Start Drawing" : "Start Drawing"}
              </Button>
              <Button
                onClick={() => {
                  if (document.querySelector("canvas")) {
                    const canvas = document.querySelector("canvas");
                    const context = canvas?.getContext("2d");
                    if (context) {
                      context.fillStyle = "#fff";
                      context.fillRect(0, 0, canvas.width, canvas.height);
                      if (handleSaveDrawing) {
                        handleSaveDrawing(canvas.toDataURL("image/png"));
                      }
                    }
                  }
                }}
                variant="outline"
                className="px-6 py-2 border border-gray-300 hover:bg-gray-100 transition-colors rounded-lg text-sm font-medium"
              >
                Clear Canvas
              </Button>
            </>
          ) : (
            <div className="text-center py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-sm text-white w-full max-w-xs">
              <p className="text-xl font-bold">
                {countdownValue > 0
                  ? `Starting in ${countdownValue}...`
                  : "GO!!!"}
              </p>
            </div>
          )}
        </div>

        {/* Game info section with improved styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
          {/* Timer - now on the left */}
          <div className="flex flex-col items-center justify-center order-1 bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            <h2 className="text-sm font-medium mb-1 text-gray-700">Time</h2>
            <div className="text-center w-full">
              <h2 className="text-2xl font-bold text-red-600">
                {timeElapsed.toFixed(1)}s
              </h2>
            </div>
          </div>

          {/* Prompt - now in the center */}
          <div className="flex flex-col items-center justify-center order-2 bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            <h2 className="text-sm font-medium mb-1 text-gray-700">
              Draw THIS:
            </h2>
            <GamePrompt
              word={currentPrompt}
              isRevealed={gameState === "playing" || gameState === "completed"}
            />
          </div>

          {/* AI Guess */}
          <div className="flex flex-col items-center justify-center order-3 bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            <h2 className="text-sm font-medium mb-1 text-gray-700">AI Guess</h2>
            {predictions.length > 0 ? (
              <div className="text-center w-full">
                <h2 className="text-2xl font-bold text-purple-600 capitalize">
                  {predictions[0].className}
                </h2>
              </div>
            ) : (
              <div className="text-center w-full">
                <h2 className="text-2xl font-bold text-gray-400">???</h2>
              </div>
            )}
          </div>
        </div>

        {/* Time limit callout - only shows after 30 seconds */}
        {timeElapsed >= 30 && (
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500 p-3 mt-4 rounded-md">
            <p className="text-amber-700 text-sm font-medium flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Might want to hurry... You only have 1 minute max to complete your
              drawing!
            </p>
          </div>
        )}
      </div>

      {/* Community Drawings Carousel */}
      <div className="rounded-xl shadow-md p-5 mb-6 border border-gray-200 bg-white">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
          Community Masterpieces
        </h2>

        {communityDrawings.length > 0 ? (
          <div className="relative">
            <div className="flex overflow-x-auto pb-3 space-x-3 scrollbar-hide">
              {communityDrawings.map((sketch, index) => (
                <div
                  key={index}
                  className="flex-none w-40 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                >
                  {sketch.image_url && (
                    <div className="relative aspect-square">
                      <img
                        src={sketch.image_url}
                        alt={`Drawing of ${sketch.object_name}`}
                        className="object-contain w-full h-full p-2"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-2 border-t border-gray-100">
                    <h3 className="font-medium text-sm capitalize mb-1 text-gray-800">
                      {sketch.object_name}
                    </h3>
                    <div className="flex justify-between items-center text-xs">
                      <span className="bg-white px-2 py-0.5 rounded-full text-blue-700 border border-blue-200">
                        {Math.round(sketch.confidence * 100)}%
                      </span>
                      <span className="bg-white px-2 py-0.5 rounded-full text-red-700 border border-red-200">
                        {sketch.time_seconds?.toFixed(1)}s
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 text-sm">
              Loading community drawings...
            </p>
          </div>
        )}

        <div className="mt-4 text-center">
          <Link
            href="/gallery"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View full gallery →
          </Link>
        </div>
      </div>

      {/* Donations Link */}
      <div className="text-center mb-6">
        <a
          href="https://google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 text-xs font-medium"
        >
          Donations Appreciated! ❤️
        </a>
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
