import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { TeamModel } from "@/models/Team";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "grandline2026";

// GET — Fetch all teams with attendance data + stats
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const authPass = req.headers.get("x-admin-key") || searchParams.get("key");

    if (authPass !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid passcode" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const q = searchParams.get("q")?.trim() || "";
    const division = searchParams.get("division");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};
    if (division && division !== "All") filter.division = division;
    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [
        { teamName: regex },
        { teamId: regex },
        { "captain.name": regex },
        { "captain.rollNo": regex },
        { "member2.name": regex },
        { "member2.rollNo": regex },
        { "member3.name": regex },
        { "member3.rollNo": regex },
        { "member4.name": regex },
        { "member4.rollNo": regex },
      ];
    }

    const teams = await TeamModel.find(filter).sort({ teamName: 1 }).lean();
    const allTeams = await TeamModel.find({}).lean();

    // Compute attendance stats across all teams
    let totalMembers = 0;
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalUnmarked = 0;

    for (const team of allTeams) {
      const hasMember4 = !!(team.member4 && team.member4.name);
      const memberKeys = hasMember4
        ? ["captain", "member2", "member3", "member4"]
        : ["captain", "member2", "member3"];

      for (const key of memberKeys) {
        totalMembers++;
        const att = team.memberAttendance?.[key as keyof typeof team.memberAttendance];
        if (att === "present") totalPresent++;
        else if (att === "absent") totalAbsent++;
        else totalUnmarked++;
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalTeams: allTeams.length,
        totalMembers,
        totalPresent,
        totalAbsent,
        totalUnmarked,
      },
      data: teams,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}

// PATCH — Update attendance for a specific team member
export async function PATCH(req: NextRequest) {
  try {
    const authPass = req.headers.get("x-admin-key");
    if (authPass !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { teamId, memberKey, status, markedBy } = body;

    // Validate
    if (!teamId || !memberKey || !status) {
      return NextResponse.json(
        { error: "teamId, memberKey, and status are required." },
        { status: 400 }
      );
    }

    const validKeys = ["captain", "member2", "member3", "member4"];
    const validStatuses = ["present", "absent", "unmarked"];

    if (!validKeys.includes(memberKey)) {
      return NextResponse.json({ error: "Invalid memberKey." }, { status: 400 });
    }
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    await connectToDatabase();

    const updateField: Record<string, unknown> = {
      [`memberAttendance.${memberKey}`]: status,
      "memberAttendance.markedAt": new Date(),
    };
    if (markedBy) updateField["memberAttendance.markedBy"] = markedBy;

    const updated = await TeamModel.findOneAndUpdate(
      { teamId },
      { $set: updateField },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
