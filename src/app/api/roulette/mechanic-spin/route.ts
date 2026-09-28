import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { TeamModel } from "@/models/Team";
import { DEVIL_FRUIT_POWERS, HAKI_POWERS, MechanicPower } from "@/data/mechanics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { teamId, teamName, mechanicType, mechanicName } = body;

    if (!teamId && !teamName) {
      return NextResponse.json(
        { error: "Team ID or Team Name is required to awaken Devil Fruit / Haki mechanics." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Look up team by ID or case-insensitive exact name
    const team = await TeamModel.findOne(
      teamId ? { teamId } : { teamName: { $regex: new RegExp(`^${teamName.trim()}$`, "i") } }
    );

    if (!team) {
      return NextResponse.json(
        { error: "Pirate crew not found. Please log in with a valid registered team name." },
        { status: 404 }
      );
    }

    // STRICT RULE: Only ONE spin allowed!
    if (team.hasSpunMechanic && team.assignedMechanicName) {
      const allPowers = [...DEVIL_FRUIT_POWERS, ...HAKI_POWERS];
      const existingMechanic = allPowers.find((m) => m.name === team.assignedMechanicName);

      return NextResponse.json(
        {
          error: `Your crew "${team.teamName}" has already awakened their power! Fate is sealed.`,
          alreadySpun: true,
          data: {
            team: {
              teamId: team.teamId,
              teamName: team.teamName,
              hasSpunMechanic: true,
              assignedMechanicType: team.assignedMechanicType,
              assignedMechanicName: team.assignedMechanicName,
              assignedMechanicDetails: team.assignedMechanicDetails || existingMechanic,
              mechanicAssignedAt: team.mechanicAssignedAt,
            },
            assignedMechanic: team.assignedMechanicDetails || existingMechanic,
          },
        },
        { status: 400 }
      );
    }

    // Determine type: Devil Fruit or Haki
    let chosenType: "Devil Fruit" | "Haki" =
      mechanicType === "Devil Fruit" || mechanicType === "Haki"
        ? mechanicType
        : Math.random() < 0.5
        ? "Devil Fruit"
        : "Haki";

    // Determine specific power among the 4 options
    const pool: MechanicPower[] =
      chosenType === "Devil Fruit" ? DEVIL_FRUIT_POWERS : HAKI_POWERS;

    let selectedMechanic: MechanicPower | undefined;
    if (mechanicName) {
      selectedMechanic = pool.find(
        (m) => m.name.toLowerCase() === mechanicName.toLowerCase()
      );
    }

    if (!selectedMechanic) {
      const randomIdx = Math.floor(Math.random() * pool.length);
      selectedMechanic = pool[randomIdx];
    }

    // Save to team record
    team.hasSpunMechanic = true;
    team.assignedMechanicType = selectedMechanic.type;
    team.assignedMechanicName = selectedMechanic.name;
    team.assignedMechanicDetails = selectedMechanic;
    team.mechanicAssignedAt = new Date();

    await team.save();

    return NextResponse.json({
      success: true,
      message: `Awakening complete! Crew "${team.teamName}" has awakened [${selectedMechanic.type}: ${selectedMechanic.name}].`,
      data: {
        team: {
          teamId: team.teamId,
          teamName: team.teamName,
          division: team.division,
          flag: team.flag,
          hasSpunMechanic: true,
          assignedMechanicType: team.assignedMechanicType,
          assignedMechanicName: team.assignedMechanicName,
          assignedMechanicDetails: team.assignedMechanicDetails,
          mechanicAssignedAt: team.mechanicAssignedAt,
        },
        assignedMechanic: selectedMechanic,
      },
    });
  } catch (error: unknown) {
    console.error("Mechanic roulette spin error:", error);
    const errMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: "Failed to process mechanic awakening: " + errMessage },
      { status: 500 }
    );
  }
}
