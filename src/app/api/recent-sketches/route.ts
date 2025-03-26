import { createClient } from "../../../../supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get date from 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get date from 2 days ago
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get count of unique users who drew today
    const { count: artistCount } = await supabase
      .from("sketches")
      .select("id", { count: "exact", head: true })
      .gte("created_at", today.toISOString());

    // Fetch random sketches from the database (only from 2-30 days ago)
    const { data: sketches, error } = await supabase
      .from("sketches")
      .select("*")
      .lt("created_at", twoDaysAgo.toISOString())
      .gt("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: false })
      .limit(12); // Get 12 sketches for the carousel

    if (error) {
      console.error("Error fetching sketches:", error);
      return NextResponse.json(
        { error: "Failed to fetch sketches" },
        { status: 500 },
      );
    }

    // Default to 78 artists if count is less than 78
    const todaysArtists = artistCount && artistCount >= 78 ? artistCount : 78;

    return NextResponse.json({ sketches, todaysArtists });
  } catch (error) {
    console.error("Error in recent sketches API:", error);
    return NextResponse.json(
      { error: "Failed to fetch sketches" },
      { status: 500 },
    );
  }
}
