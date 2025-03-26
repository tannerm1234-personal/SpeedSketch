import DashboardNavbar from "@/components/dashboard-navbar";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import GameCanvas from "@/components/game-canvas";
import CountdownTimer from "@/components/countdown-timer";
import GamePrompt from "@/components/game-prompt";
import RecognitionDisplay from "@/components/recognition-display";
import { Button } from "@/components/ui/button";

export default async function GamePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // This would normally fetch from the database
  const samplePrompt = "cat";
  const samplePredictions = [
    { className: "cat", probability: 0.65 },
    { className: "dog", probability: 0.25 },
    { className: "rabbit", probability: 0.1 },
  ];

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            SpeedSketch Challenge
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Left column - Timer */}
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-lg font-medium mb-4">Time Remaining</h2>
              <CountdownTimer duration={15} isRunning={false} size="lg" />
            </div>

            {/* Middle column - Prompt */}
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-lg font-medium mb-4">Your Prompt</h2>
              <GamePrompt word={samplePrompt} />
            </div>

            {/* Right column - AI Recognition */}
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-lg font-medium mb-4">AI Recognition</h2>
              <RecognitionDisplay predictions={samplePredictions} />
            </div>
          </div>

          {/* Canvas */}
          <div className="flex flex-col items-center mb-8">
            <GameCanvas width={400} height={400} isEnabled={false} />
          </div>

          {/* Game controls */}
          <div className="flex justify-center gap-4">
            <Button size="lg" className="px-8">
              Start Game
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              How to Play
            </Button>
          </div>

          {/* Instructions */}
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">How to Play</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Click "Start Game" to begin the challenge</li>
              <li>You'll be given a random word to draw</li>
              <li>Draw the word on the canvas as clearly as possible</li>
              <li>The AI will try to recognize your drawing in real-time</li>
              <li>
                You win if the AI recognizes your drawing with 90% confidence
                before the 15-second timer expires
              </li>
              <li>
                Your score is based on how much time remains when the AI
                recognizes your drawing
              </li>
            </ol>
          </div>
        </div>
      </main>
    </>
  );
}
