import { createClient } from "../../../../supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get tomorrow's date at midnight
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch the top time from today's sketches
    const { data, error } = await supabase
      .from("sketches")
      .select("time_seconds")
      .gte("created_at", today.toISOString())
      .lt("created_at", tomorrow.toISOString())
      .order("time_seconds", { ascending: true })
      .limit(1);

    if (error) {
      console.error("Error fetching top time:", error);
      return NextResponse.json(
        { error: "Failed to fetch top time" },
        { status: 500 },
      );
    }

    // Return the top time if available, or default to 14.2 seconds
    const topTime = data && data.length > 0 ? data[0].time_seconds : 14.2;
    return NextResponse.json({ topTime });
  } catch (error) {
    console.error("Error in top time API:", error);
    return NextResponse.json(
      { error: "Failed to fetch top time" },
      { status: 500 },
    );
  }
}
