import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { TeamModel } from "@/models/Team";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "grandline2026";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const authPass = req.headers.get("x-admin-key") || searchParams.get("key");

    if (authPass !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid Grand Line Admiral passcode" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const q = searchParams.get("q")?.trim() || "";
    const division = searchParams.get("division");
    const status = searchParams.get("status");
    const roulette = searchParams.get("roulette");
    const mechanic = searchParams.get("mechanic");

    // Build filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (division && division !== "All") {
      filter.division = division;
    }

    if (status && status !== "All") {
      filter.status = status;
    }

    if (roulette === "Spun") {
      filter.hasSpunRoulette = true;
    } else if (roulette === "Pending") {
      filter.hasSpunRoulette = { $ne: true };
    }

    if (mechanic === "Devil Fruit") {
      filter.assignedMechanicType = "Devil Fruit";
    } else if (mechanic === "Haki") {
      filter.assignedMechanicType = "Haki";
    } else if (mechanic === "Spun") {
      filter.hasSpunMechanic = true;
    } else if (mechanic === "Pending") {
      filter.hasSpunMechanic = { $ne: true };
    }

    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [
        { teamName: regex },
        { teamId: regex },
        { assignedProblemTitle: regex },
        { assignedProblemId: regex },
        { assignedMechanicName: regex },
        { assignedMechanicType: regex },
        { "captain.name": regex },
        { "captain.email": regex },
        { "captain.rollNo": regex },
        { "member2.name": regex },
        { "member3.name": regex },
        { "member4.name": regex },
      ];
    }

    const teams = await TeamModel.find(filter).sort({ createdAt: -1 }).lean();

    // Calculate live metrics across ALL teams
    const allTeams = await TeamModel.find({}).lean();
    const totalTeams = allTeams.length;
    let totalParticipants = 0;
    let freshersCount = 0;
    let seniorsCount = 0;
    let checkedInCount = 0;
    let spunCount = 0;
    let pendingSpinCount = 0;
    let spunMechanicCount = 0;
    let devilFruitCount = 0;
    let hakiCount = 0;

    for (const team of allTeams) {
      // 1 captain + member2 + member3 + (optional member4)
      const memberCount = 3 + (team.member4 && team.member4.name ? 1 : 0);
      totalParticipants += memberCount;

      if (team.division === "Freshers (Level 1)") {
        freshersCount++;
      } else {
        seniorsCount++;
      }

      if (team.status === "Checked-In") {
        checkedInCount++;
      }

      if (team.hasSpunRoulette) {
        spunCount++;
      } else {
        pendingSpinCount++;
      }

      if (team.hasSpunMechanic) {
        spunMechanicCount++;
        if (team.assignedMechanicType === "Devil Fruit") {
          devilFruitCount++;
        } else if (team.assignedMechanicType === "Haki") {
          hakiCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalTeams,
        totalParticipants,
        freshersCount,
        seniorsCount,
        checkedInCount,
        spunCount,
        pendingSpinCount,
        spunMechanicCount,
        devilFruitCount,
        hakiCount,
      },
      data: teams,
    });
  } catch (error: unknown) {
    console.error("Admin fetch teams error:", error);
    const errMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: "Failed to fetch registered teams: " + errMessage },
      { status: 500 }
    );
  }
}
