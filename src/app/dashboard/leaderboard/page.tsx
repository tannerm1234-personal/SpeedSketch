import DashboardNavbar from "@/components/dashboard-navbar";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Clock, Calendar, Medal } from "lucide-react";

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Sample leaderboard data
  const globalLeaderboard = [
    {
      rank: 1,
      name: "ArtMaster",
      gamesWon: 120,
      bestStreak: 15,
      fastestTime: 12.3,
    },
    {
      rank: 2,
      name: "SketchWizard",
      gamesWon: 105,
      bestStreak: 12,
      fastestTime: 10.5,
    },
    {
      rank: 3,
      name: "DrawingPro",
      gamesWon: 98,
      bestStreak: 10,
      fastestTime: 9.8,
    },
    {
      rank: 4,
      name: "PencilNinja",
      gamesWon: 87,
      bestStreak: 9,
      fastestTime: 8.7,
    },
    {
      rank: 5,
      name: "CanvasKing",
      gamesWon: 76,
      bestStreak: 8,
      fastestTime: 11.2,
    },
  ];

  const dailyLeaderboard = [
    {
      rank: 1,
      name: "QuickDraw",
      word: "bicycle",
      timeRemaining: 8.7,
      date: "Today",
    },
    {
      rank: 2,
      name: "ArtGenius",
      word: "bicycle",
      timeRemaining: 7.2,
      date: "Today",
    },
    {
      rank: 3,
      name: "SketchMaster",
      word: "bicycle",
      timeRemaining: 6.5,
      date: "Today",
    },
    {
      rank: 4,
      name: "DrawFast",
      word: "bicycle",
      timeRemaining: 5.9,
      date: "Today",
    },
    {
      rank: 5,
      name: "PenWizard",
      word: "bicycle",
      timeRemaining: 4.3,
      date: "Today",
    },
  ];

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            SpeedSketch Leaderboards
          </h1>

          <Tabs defaultValue="global" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="global" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Global Rankings
              </TabsTrigger>
              <TabsTrigger value="daily" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Daily Challenge
              </TabsTrigger>
            </TabsList>

            <TabsContent value="global" className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Global Leaderboard
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left">Rank</th>
                      <th className="py-3 text-left">Player</th>
                      <th className="py-3 text-right">Games Won</th>
                      <th className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Medal className="w-4 h-4" />
                          Best Streak
                        </div>
                      </th>
                      <th className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Clock className="w-4 h-4" />
                          Fastest Time
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {globalLeaderboard.map((player) => (
                      <tr
                        key={player.rank}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3">
                          <div className="flex items-center">
                            {player.rank === 1 ? (
                              <span className="text-yellow-500 font-bold">
                                #1
                              </span>
                            ) : player.rank === 2 ? (
                              <span className="text-gray-400 font-bold">
                                #2
                              </span>
                            ) : player.rank === 3 ? (
                              <span className="text-amber-600 font-bold">
                                #3
                              </span>
                            ) : (
                              <span>#{player.rank}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 font-medium">{player.name}</td>
                        <td className="py-3 text-right">{player.gamesWon}</td>
                        <td className="py-3 text-right">{player.bestStreak}</td>
                        <td className="py-3 text-right">
                          {player.fastestTime}s
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="daily" className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Today's Challenge: "Bicycle"
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 text-left">Rank</th>
                      <th className="py-3 text-left">Player</th>
                      <th className="py-3 text-left">Word</th>
                      <th className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Clock className="w-4 h-4" />
                          Time Remaining
                        </div>
                      </th>
                      <th className="py-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyLeaderboard.map((player) => (
                      <tr
                        key={player.rank}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-3">
                          <div className="flex items-center">
                            {player.rank === 1 ? (
                              <span className="text-yellow-500 font-bold">
                                #1
                              </span>
                            ) : player.rank === 2 ? (
                              <span className="text-gray-400 font-bold">
                                #2
                              </span>
                            ) : player.rank === 3 ? (
                              <span className="text-amber-600 font-bold">
                                #3
                              </span>
                            ) : (
                              <span>#{player.rank}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 font-medium">{player.name}</td>
                        <td className="py-3">{player.word}</td>
                        <td className="py-3 text-right">
                          {player.timeRemaining}s
                        </td>
                        <td className="py-3 text-right">{player.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
