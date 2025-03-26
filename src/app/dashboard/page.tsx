import DashboardNavbar from "@/components/dashboard-navbar";
import {
  InfoIcon,
  UserCircle,
  Pencil,
  Trophy,
  Image,
  Clock,
  Calendar,
  Medal,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Sample user stats
  const userStats = {
    gamesPlayed: 42,
    gamesWon: 35,
    currentStreak: 7,
    bestStreak: 12,
    fastestTime: 8.2,
    averageTime: 10.5,
    rank: 24,
  };

  // Sample recent games
  const recentGames = [
    { id: 1, word: "cat", success: true, timeRemaining: 7.2, date: "Today" },
    {
      id: 2,
      word: "bicycle",
      success: true,
      timeRemaining: 6.5,
      date: "Today",
    },
    {
      id: 3,
      word: "house",
      success: false,
      timeRemaining: 0,
      date: "Yesterday",
    },
    {
      id: 4,
      word: "tree",
      success: true,
      timeRemaining: 9.1,
      date: "Yesterday",
    },
  ];

  return (
    <>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">SpeedSketch Dashboard</h1>
              <Link href="/dashboard/game">
                <Button size="lg" className="gap-2">
                  <Pencil className="w-4 h-4" />
                  Play Now
                </Button>
              </Link>
            </div>
            <div className="bg-blue-50 text-sm p-4 px-5 rounded-lg text-blue-700 flex gap-2 items-center border border-blue-100">
              <Calendar className="w-4 h-4" />
              <span>
                Today's challenge: Draw a "bicycle" - Complete it to maintain
                your streak!
              </span>
            </div>
          </header>

          {/* Stats Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Games Played</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {userStats.gamesPlayed}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Success Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {Math.round(
                    (userStats.gamesWon / userStats.gamesPlayed) * 100,
                  )}
                  %
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Current Streak</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {userStats.currentStreak}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Global Rank</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">#{userStats.rank}</div>
              </CardContent>
            </Card>
          </section>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Profile Section */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <UserCircle size={64} className="text-primary" />
                  <div>
                    <h3 className="font-semibold text-xl">
                      {user.user_metadata?.full_name || user.email}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Best Streak</span>
                    <span className="font-medium flex items-center gap-1">
                      <Medal className="w-4 h-4 text-yellow-500" />
                      {userStats.bestStreak} days
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fastest Time</span>
                    <span className="font-medium flex items-center gap-1">
                      <Clock className="w-4 h-4 text-green-500" />
                      {userStats.fastestTime}s
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Time</span>
                    <span className="font-medium">
                      {userStats.averageTime}s
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Link href="/dashboard/leaderboard">
                  <Button variant="outline" className="gap-1">
                    <Trophy className="w-4 h-4" />
                    Leaderboard
                  </Button>
                </Link>
                <Link href="/dashboard/gallery">
                  <Button variant="outline" className="gap-1">
                    <Image className="w-4 h-4" />
                    Gallery
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Recent Games Section */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Games</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 text-left">Word</th>
                        <th className="py-3 text-left">Result</th>
                        <th className="py-3 text-right">Time Left</th>
                        <th className="py-3 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentGames.map((game) => (
                        <tr key={game.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 font-medium">{game.word}</td>
                          <td className="py-3">
                            {game.success ? (
                              <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium">
                                Success
                              </span>
                            ) : (
                              <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium">
                                Failed
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            {game.success ? `${game.timeRemaining}s` : "-"}
                          </td>
                          <td className="py-3 text-right text-gray-500">
                            {game.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Link href="/dashboard/game">
                  <Button className="gap-1">
                    <Pencil className="w-4 h-4" />
                    Play New Game
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
