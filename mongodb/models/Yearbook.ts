import mongoose, { Schema, Document } from "mongoose"

export interface IYearbook extends Document {
  ownedBy: mongoose.Schema.Types.ObjectId // reference to User
  fullName: string
  course?: string
  yearLevel?: string
  schoolYear?: string
  block?: string
  quote?: string
  ambition?: string
  hobbies?: string
  honors?: string
  motherName?: string
  fatherName?: string
  officerRole?: string
  department?: string
  position?: string
  yearsOfService?: string
  legacy?: string
  messageToStudents?: string
  graduationYear?: string
  work?: string
  company?: string
  location?: string
  advice?: string
  contribution?: string
  profileUrl?: string // later we’ll use this
}

const YearbookSchema = new Schema<IYearbook>(
  {
    ownedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    course: String,
    yearLevel: String,
    schoolYear: String,
    block: String,
    quote: String,
    ambition: String,
    hobbies: String,
    honors: String,
    motherName: String,
    fatherName: String,
    officerRole: String,
    department: String,
    position: String,
    yearsOfService: String,
    legacy: String,
    messageToStudents: String,
    graduationYear: String,
    work: String,
    company: String,
    location: String,
    advice: String,
    contribution: String,
    profileUrl: String,
  },
  { timestamps: true }
)

export default mongoose.models.Yearbook || mongoose.model<IYearbook>("Yearbook", YearbookSchema)
