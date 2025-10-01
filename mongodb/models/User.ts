// mongodb/models/User.ts
import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  schoolId: string
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
}

const UserSchema: Schema<IUser> = new Schema(
  {
    schoolId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "teacher", "alumni"], default: "student" },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
