import mongoose, { Schema, model, models } from "mongoose"

const AlumniSchema = new Schema(
  {
    schoolId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "alumni" },
  },
  { timestamps: true }
)

const Alumni = models.Alumni || model("Alumni", AlumniSchema, "Alumni")
export default Alumni
