import mongoose, { Schema, model, models } from "mongoose"

const TeacherSchema = new Schema(
  {
    schoolId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "teacher" },
  },
  { timestamps: true }
)

const Teacher = models.Teacher || model("Teacher", TeacherSchema, "Teacher")
export default Teacher
