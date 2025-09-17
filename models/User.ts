import mongoose, { Schema, model, models } from "mongoose"

const UserSchema = new Schema(
  {
    schoolId: {
      type: String,
      required: true,
      unique: true, // each student ID must be unique
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // each email must be unique
    },
    password: {
      type: String,
      required: true, // plain text since you requested no scrambling
    },
  },
  { timestamps: true }
)

// Prevent model overwrite upon hot reload in Next.js
const User = models.User || model("User", UserSchema)

export default User
