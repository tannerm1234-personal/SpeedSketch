import DashboardNavbar from "@/components/dashboard-navbar";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, ThumbsUp, Clock } from "lucide-react";

export default async function GalleryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Sample gallery data
  const galleryItems = [
    {
      id: 1,
      user: "ArtMaster",
      word: "cat",
      timeRemaining: 8.2,
      likes: 24,
      date: "2 hours ago",
      imageUrl:
        "https://images.unsplash.com/photo-1615639164213-aab04da93c7c?w=400&q=80",
    },
    {
      id: 2,
      user: "SketchWizard",
      word: "bicycle",
      timeRemaining: 7.5,
      likes: 18,
      date: "5 hours ago",
      imageUrl:
        "https://images.unsplash.com/photo-1541781550486-81b7a2328578?w=400&q=80",
    },
    {
      id: 3,
      user: "DrawingPro",
      word: "house",
      timeRemaining: 6.8,
      likes: 15,
      date: "Yesterday",
      imageUrl:
        "https://images.unsplash.com/photo-1582566589314-9c7c2e25320b?w=400&q=80",
    },
    {
      id: 4,
      user: "PencilNinja",
      word: "tree",
      timeRemaining: 9.1,
      likes: 32,
      date: "Yesterday",
      imageUrl:
        "https://images.unsplash.com/photo-1582566589314-9c7c2e25320b?w=400&q=80",
    },
    {
      id: 5,
      user: "CanvasKing",
      word: "sun",
      timeRemaining: 10.3,
      likes: 27,
      date: "2 days ago",
      imageUrl:
        "https://images.unsplash.com/photo-1582566589314-9c7c2e25320b?w=400&q=80",
    },
    {
      id: 6,
      user: "ArtGenius",
      word: "car",
      timeRemaining: 5.7,
      likes: 14,
      date: "3 days ago",
      imageUrl:
        "https://images.unsplash.com/photo-1582566589314-9c7c2e25320b?w=400&q=80",
    },
  ];

  return (
    <>
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">
            SpeedSketch Gallery
          </h1>

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold">Recent Sketches</h2>
            <div className="flex gap-2">
              <Button variant="outline">My Sketches</Button>
              <Button variant="outline">Popular</Button>
              <Button variant="outline">Recent</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{item.word}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{item.timeRemaining}s left</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={item.imageUrl}
                      alt={`Drawing of ${item.word}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-4 flex justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{item.user}</span> ·{" "}
                    {item.date}
                  </div>
                  <div className="flex gap-3">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {item.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </div>
      </main>
    </>
  );
}
