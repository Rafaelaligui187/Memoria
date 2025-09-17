import mongoose, { Schema, model, models } from "mongoose"

const StudentSchema = new Schema(
  {
    schoolId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "student" },
  },
  { timestamps: true }
)

const Student = models.Student || model("Student", StudentSchema, "Student")
export default Student
