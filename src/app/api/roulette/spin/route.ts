import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { TeamModel } from "@/models/Team";
import { PROBLEM_STATEMENTS } from "@/data/problems";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { teamId, teamName, problemNumber } = body;

    if (!teamId && !teamName) {
      return NextResponse.json(
        { error: "Team ID or Team Name is required to spin the Grand Line Roulette." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Look up team by ID or name
    const team = await TeamModel.findOne(
      teamId ? { teamId } : { teamName: { $regex: new RegExp(`^${teamName.trim()}$`, "i") } }
    );

    if (!team) {
      return NextResponse.json(
        { error: "Pirate crew not found. Please log in with a valid team name." },
        { status: 404 }
      );
    }

    // STRICT RULE: Only ONE spin allowed!
    if (team.hasSpunRoulette && team.assignedProblemTitle) {
      const existingProblem = PROBLEM_STATEMENTS.find(
        (p) => p.number === team.assignedProblemNumber || p.id === team.assignedProblemId
      );

      return NextResponse.json(
        {
          error: `Your crew "${team.teamName}" has already spun the roulette! Fate is sealed.`,
          alreadySpun: true,
          data: {
            team: {
              teamId: team.teamId,
              teamName: team.teamName,
              hasSpunRoulette: true,
              assignedProblemTitle: team.assignedProblemTitle,
              assignedProblemId: team.assignedProblemId,
              assignedProblemNumber: team.assignedProblemNumber,
              assignedAt: team.assignedAt,
            },
            assignedProblem: existingProblem || {
              id: team.assignedProblemId,
              number: team.assignedProblemNumber,
              title: team.assignedProblemTitle,
            },
          },
        },
        { status: 400 }
      );
    }

    // Select the problem statement
    let selectedProblem = null;
    if (typeof problemNumber === "number" && problemNumber >= 1 && problemNumber <= 10) {
      selectedProblem = PROBLEM_STATEMENTS.find((p) => p.number === problemNumber);
    }

    // Fallback to random if not specified or not found
    if (!selectedProblem) {
      const randomIndex = Math.floor(Math.random() * PROBLEM_STATEMENTS.length);
      selectedProblem = PROBLEM_STATEMENTS[randomIndex];
    }

    // Lock in the problem assignment in DB
    team.hasSpunRoulette = true;
    team.assignedProblemTitle = selectedProblem.title;
    team.assignedProblemId = selectedProblem.id;
    team.assignedProblemNumber = selectedProblem.number;
    team.assignedAt = new Date();

    await team.save();

    return NextResponse.json({
      success: true,
      message: `Congratulations! Crew "${team.teamName}" has been assigned "${selectedProblem.title}".`,
      data: {
        team: {
          teamId: team.teamId,
          teamName: team.teamName,
          division: team.division,
          flag: team.flag,
          captain: team.captain,
          hasSpunRoulette: true,
          assignedProblemTitle: team.assignedProblemTitle,
          assignedProblemId: team.assignedProblemId,
          assignedProblemNumber: team.assignedProblemNumber,
          assignedAt: team.assignedAt,
        },
        assignedProblem: selectedProblem,
      },
    });
  } catch (error: unknown) {
    console.error("Roulette spin assignment error:", error);
    const errMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: "Failed to process roulette spin: " + errMessage },
      { status: 500 }
    );
  }
}
