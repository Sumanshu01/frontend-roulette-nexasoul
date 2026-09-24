import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { TeamModel } from "@/models/Team";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      crewName,
      division,
      flag,
      captain,
      member2,
      member3,
      member4,
      bounty,
    } = body;

    // Validation
    if (
      !crewName?.trim() ||
      !division ||
      !captain?.name?.trim() ||
      !captain?.email?.trim() ||
      !captain?.rollNo?.trim() ||
      !captain?.phone?.trim() ||
      !member2?.name?.trim() ||
      !member2?.email?.trim() ||
      !member2?.rollNo?.trim() ||
      !member3?.name?.trim() ||
      !member3?.email?.trim() ||
      !member3?.rollNo?.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields. Captain and at least 2 members with Name, Email & College Roll Number are required.",
        },
        { status: 400 }
      );
    }

    if (
      member4 &&
      (member4.name || member4.email || member4.rollNo) &&
      (!member4.name?.trim() || !member4.email?.trim() || !member4.rollNo?.trim())
    ) {
      return NextResponse.json(
        {
          error:
            "Member 4 details are incomplete. Please provide Name, Email & Roll Number or remove Member 4.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check for duplicate team name
    const existingTeam = await TeamModel.findOne({
      teamName: { $regex: new RegExp(`^${crewName.trim()}$`, "i") },
    });

    if (existingTeam) {
      return NextResponse.json(
        {
          error: `A pirate crew named "${crewName.trim()}" is already enlisted! Please choose a distinctive crew title.`,
        },
        { status: 409 }
      );
    }

    // Check for duplicate captain email or rollNo
    const existingCaptain = await TeamModel.findOne({
      $or: [
        { "captain.email": captain.email.trim().toLowerCase() },
        { "captain.rollNo": captain.rollNo.trim().toUpperCase() },
      ],
    });

    if (existingCaptain) {
      return NextResponse.json(
        {
          error: `A crew with this Captain Email (${captain.email}) or College Roll No (${captain.rollNo}) is already registered!`,
        },
        { status: 409 }
      );
    }

    // Generate unique pirate registration code
    let randomId = "CREW-NEXA-" + Math.floor(1000 + Math.random() * 9000);
    let idExists = await TeamModel.findOne({ teamId: randomId });
    while (idExists) {
      randomId = "CREW-NEXA-" + Math.floor(1000 + Math.random() * 9000);
      idExists = await TeamModel.findOne({ teamId: randomId });
    }

    const calculatedBounty =
      bounty ||
      (division === "Freshers (Level 1)"
        ? "฿ 300,000,000"
        : "฿ 850,000,000");

    const newTeam = await TeamModel.create({
      teamId: randomId,
      teamName: crewName.trim(),
      division,
      flag: flag || "👒 Straw Hat Fleet",
      captain: {
        name: captain.name.trim(),
        email: captain.email.trim().toLowerCase(),
        phone: captain.phone.trim(),
        rollNo: captain.rollNo.trim().toUpperCase(),
        github: captain.github ? captain.github.trim() : "",
      },
      member2: {
        name: member2.name.trim(),
        email: member2.email.trim().toLowerCase(),
        rollNo: member2.rollNo.trim().toUpperCase(),
        role: member2.role || "Frontend Engineer",
      },
      member3: {
        name: member3.name.trim(),
        email: member3.email.trim().toLowerCase(),
        rollNo: member3.rollNo.trim().toUpperCase(),
        role: member3.role || "UI/UX Designer",
      },
      member4:
        member4 && member4.name?.trim()
          ? {
              name: member4.name.trim(),
              email: member4.email.trim().toLowerCase(),
              rollNo: member4.rollNo.trim().toUpperCase(),
              role: member4.role || "Full Stack / Integration",
            }
          : undefined,
      bounty: calculatedBounty,
      status: "Registered",
      registeredAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Pirate Crew registered successfully!",
        data: newTeam,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);
    const errMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: "Failed to save registration: " + errMessage },
      { status: 500 }
    );
  }
}
