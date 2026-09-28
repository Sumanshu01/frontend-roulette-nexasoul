import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { TeamModel } from "@/models/Team";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "grandline2026";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authPass = req.headers.get("x-admin-key");
    if (authPass !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid Grand Line Admiral passcode" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    await connectToDatabase();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateFields: Record<string, any> = {};
    if (body.status !== undefined) updateFields.status = body.status;
    if (body.hasSpunRoulette !== undefined) updateFields.hasSpunRoulette = body.hasSpunRoulette;
    if (body.assignedProblemTitle !== undefined) updateFields.assignedProblemTitle = body.assignedProblemTitle;
    if (body.assignedProblemId !== undefined) updateFields.assignedProblemId = body.assignedProblemId;
    if (body.assignedProblemNumber !== undefined) updateFields.assignedProblemNumber = body.assignedProblemNumber;
    if (body.assignedAt !== undefined) updateFields.assignedAt = body.assignedAt;

    if (body.resetSpin === true) {
      updateFields.hasSpunRoulette = false;
      updateFields.assignedProblemTitle = null;
      updateFields.assignedProblemId = null;
      updateFields.assignedProblemNumber = null;
      updateFields.assignedAt = null;
    }

    const updated = await TeamModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Crew record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: "Failed to update crew status: " + errMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authPass = req.headers.get("x-admin-key");
    if (authPass !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid Grand Line Admiral passcode" },
        { status: 401 }
      );
    }

    const { id } = await params;

    await connectToDatabase();

    const deleted = await TeamModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Crew record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Crew removed from records" });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json(
      { error: "Failed to delete crew: " + errMessage },
      { status: 500 }
    );
  }
}
