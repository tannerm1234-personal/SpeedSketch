import { createClient } from "../../../supabase/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export const revalidate = 0; // Disable caching for this page

export default async function GalleryPage() {
  const supabase = await createClient();

  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Fetch sketches from the database (only from previous days)
  const { data: sketches, error } = await supabase
    .from("sketches")
    .select("*")
    .lt("created_at", today.toISOString())
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching sketches:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-5 mb-6 border-t-4 border-blue-500">
          <div className="flex items-center mb-4">
            <Link
              href="/"
              className="flex items-center text-black hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Game
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-1 text-center text-black">
            SpeedSketch Gallery
          </h1>
          <p className="text-gray-600 text-center text-sm">
            Community masterpieces from previous days
          </p>
        </div>

        {sketches && sketches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sketches.map((sketch) => (
              <div
                key={sketch.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 duration-200"
              >
                <div className="relative aspect-square bg-gray-50">
                  <Image
                    src={sketch.image_url}
                    alt={`Drawing of ${sketch.object_name}`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="p-3 border-t border-gray-100">
                  <h3 className="font-medium text-base capitalize mb-1 text-gray-800">
                    {sketch.object_name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <div className="bg-blue-50 px-3 py-1 rounded-full">
                      <span className="text-blue-700 font-medium">
                        {Math.round(sketch.confidence * 100)}% match
                      </span>
                    </div>
                    <div className="bg-red-50 px-3 py-1 rounded-full">
                      <span className="text-red-700 font-medium">
                        {sketch.time_seconds.toFixed(1)}s
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(sketch.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No sketches found. Start drawing to add some!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
