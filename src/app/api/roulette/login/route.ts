import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { TeamModel } from "@/models/Team";

function escapeRegex(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const teamName = body.teamName?.trim();

    if (!teamName) {
      return NextResponse.json(
        { error: "Please enter your pirate crew (team) name." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Case-insensitive exact match
    const team = await TeamModel.findOne({
      teamName: { $regex: new RegExp(`^${escapeRegex(teamName)}$`, "i") },
    }).lean();

    if (!team) {
      // Find similar suggestions if possible
      const suggestions = await TeamModel.find({
        teamName: { $regex: new RegExp(escapeRegex(teamName), "i") },
      })
        .limit(3)
        .select("teamName")
        .lean();

      const suggestionList = suggestions.map((s) => s.teamName);

      return NextResponse.json(
        {
          error: `No pirate crew registered under "${teamName}". Please ensure your team is registered first or check your spelling.`,
          suggestions: suggestionList.length > 0 ? suggestionList : undefined,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: team._id,
        teamId: team.teamId,
        teamName: team.teamName,
        division: team.division,
        flag: team.flag,
        captainName: team.captain?.name,
        captainEmail: team.captain?.email,
        hasSpunRoulette: !!team.hasSpunRoulette,
        assignedProblemTitle: team.assignedProblemTitle || null,
        assignedProblemId: team.assignedProblemId || null,
        assignedProblemNumber: team.assignedProblemNumber || null,
        assignedAt: team.assignedAt || null,
      },
    });
  } catch (error: unknown) {
    console.error("Roulette login error:", error);
    const errMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: "Failed to authenticate crew: " + errMessage },
      { status: 500 }
    );
  }
}
