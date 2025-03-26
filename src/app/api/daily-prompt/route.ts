import { createClient } from "../../../../supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // First, check if there's already a prompt used today
    const { data: todaysPrompt, error: todaysPromptError } = await supabase
      .from("game_prompts")
      .select("*")
      .gte("last_used", today.toISOString())
      .order("last_used", { ascending: false })
      .limit(1);

    if (todaysPromptError) {
      console.error("Error fetching today's prompt:", todaysPromptError);
      return NextResponse.json(
        { error: "Failed to fetch today's prompt" },
        { status: 500 },
      );
    }

    // If we already have a prompt for today, return it
    if (todaysPrompt && todaysPrompt.length > 0) {
      return NextResponse.json({ prompt: todaysPrompt[0] });
    }

    // Otherwise, find a prompt that hasn't been used yet
    const { data: unusedPrompt, error: unusedPromptError } = await supabase
      .from("game_prompts")
      .select("*")
      .is("last_used", null)
      .eq("active", true)
      .order("id", { ascending: true })
      .limit(1);

    if (unusedPromptError) {
      console.error("Error fetching unused prompt:", unusedPromptError);
      return NextResponse.json(
        { error: "Failed to fetch unused prompt" },
        { status: 500 },
      );
    }

    let selectedPrompt;

    // If we have an unused prompt, use it
    if (unusedPrompt && unusedPrompt.length > 0) {
      selectedPrompt = unusedPrompt[0];
    } else {
      // If all prompts have been used, find the oldest used prompt
      const { data: oldestPrompt, error: oldestPromptError } = await supabase
        .from("game_prompts")
        .select("*")
        .eq("active", true)
        .order("last_used", { ascending: true })
        .limit(1);

      if (oldestPromptError) {
        console.error("Error fetching oldest prompt:", oldestPromptError);
        return NextResponse.json(
          { error: "Failed to fetch oldest prompt" },
          { status: 500 },
        );
      }

      if (!oldestPrompt || oldestPrompt.length === 0) {
        return NextResponse.json(
          { error: "No prompts available" },
          { status: 404 },
        );
      }

      selectedPrompt = oldestPrompt[0];
    }

    // Update the last_used date for the selected prompt
    const { error: updateError } = await supabase
      .from("game_prompts")
      .update({ last_used: new Date().toISOString() })
      .eq("id", selectedPrompt.id);

    if (updateError) {
      console.error("Error updating prompt last_used date:", updateError);
      // Still return the prompt even if the update fails
    }

    return NextResponse.json({ prompt: selectedPrompt });
  } catch (error) {
    console.error("Error in daily prompt API:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily prompt" },
      { status: 500 },
    );
  }
}
