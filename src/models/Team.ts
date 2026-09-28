import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICrewMember {
  name: string;
  email: string;
  rollNo: string;
  role?: string;
}

export interface ICaptain {
  name: string;
  email: string;
  phone: string;
  rollNo: string;
  github?: string;
}

export interface IMemberAttendance {
  captain?: "present" | "absent" | "unmarked";
  member2?: "present" | "absent" | "unmarked";
  member3?: "present" | "absent" | "unmarked";
  member4?: "present" | "absent" | "unmarked";
  markedAt?: Date;
  markedBy?: string;
}

export interface IRegisteredTeam extends Document {
  teamId: string;
  teamName: string;
  division: "Freshers (Level 1)" | "Senior (Levels 2 & 3)";
  flag: string;
  captain: ICaptain;
  member2: ICrewMember;
  member3: ICrewMember;
  member4?: ICrewMember;
  bounty: string;
  status: "Registered" | "Checked-In";
  assignedProblemTitle?: string;
  assignedProblemId?: string;
  assignedProblemNumber?: number;
  hasSpunRoulette?: boolean;
  assignedAt?: Date;
  memberAttendance?: IMemberAttendance;
  registeredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<IRegisteredTeam>(
  {
    teamId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    teamName: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
    },
    division: {
      type: String,
      required: [true, "Division is required"],
      enum: ["Freshers (Level 1)", "Senior (Levels 2 & 3)"],
    },
    flag: {
      type: String,
      default: "👒 Straw Hat Fleet",
    },
    captain: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
      rollNo: { type: String, required: true, trim: true },
      github: { type: String, default: "", trim: true },
    },
    member2: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      rollNo: { type: String, required: true, trim: true },
      role: { type: String, default: "Frontend Engineer" },
    },
    member3: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      rollNo: { type: String, required: true, trim: true },
      role: { type: String, default: "UI/UX Designer" },
    },
    member4: {
      name: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      rollNo: { type: String, trim: true },
      role: { type: String, default: "Full Stack / Integration" },
    },
    bounty: {
      type: String,
      default: "฿ 500,000,000",
    },
    status: {
      type: String,
      enum: ["Registered", "Checked-In"],
      default: "Registered",
    },
    assignedProblemTitle: {
      type: String,
      default: null,
    },
    assignedProblemId: {
      type: String,
      default: null,
    },
    assignedProblemNumber: {
      type: Number,
      default: null,
    },
    hasSpunRoulette: {
      type: Boolean,
      default: false,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    memberAttendance: {
      captain: { type: String, enum: ["present", "absent", "unmarked"], default: "unmarked" },
      member2: { type: String, enum: ["present", "absent", "unmarked"], default: "unmarked" },
      member3: { type: String, enum: ["present", "absent", "unmarked"], default: "unmarked" },
      member4: { type: String, enum: ["present", "absent", "unmarked"], default: "unmarked" },
      markedAt: { type: Date, default: null },
      markedBy: { type: String, default: null },
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose model overwrite in hot reload
export const TeamModel: Model<IRegisteredTeam> =
  mongoose.models.Team || mongoose.model<IRegisteredTeam>("Team", TeamSchema);
