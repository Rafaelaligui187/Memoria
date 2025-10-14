import { connectToDatabase } from "@/lib/mongodb/connection"
import { ObjectId } from "mongodb"

export async function getSchoolYearLabel(schoolYearId: string): Promise<string> {
  try {
    if (!schoolYearId || schoolYearId.trim() === '') {
      return "—"
    }

    // If it's already in the correct format (e.g., "2025-2026"), return as is
    if (schoolYearId.match(/^\d{4}-\d{4}$/)) {
      return schoolYearId
    }

    // If it's a MongoDB ObjectId, fetch the actual year label
    if (ObjectId.isValid(schoolYearId)) {
      const db = await connectToDatabase()
      const schoolYear = await db.collection('SchoolYears').findOne({
        _id: new ObjectId(schoolYearId)
      })

      if (schoolYear && schoolYear.yearLabel) {
        return schoolYear.yearLabel
      }
    }

    // Fallback: return the original value
    return schoolYearId
  } catch (error) {
    console.error("[School Year Utils] Error getting school year label:", error)
    return schoolYearId || "—"
  }
}

export async function getSchoolYearLabels(schoolYearIds: string[]): Promise<Record<string, string>> {
  try {
    const db = await connectToDatabase()
    const validObjectIds = schoolYearIds.filter(id => ObjectId.isValid(id))
    
    if (validObjectIds.length === 0) {
      return {}
    }

    const schoolYears = await db.collection('SchoolYears').find({
      _id: { $in: validObjectIds.map(id => new ObjectId(id)) }
    }).toArray()

    const labelMap: Record<string, string> = {}
    
    schoolYears.forEach(year => {
      labelMap[year._id.toString()] = year.yearLabel
    })

    // Add entries for IDs that are already in the correct format
    schoolYearIds.forEach(id => {
      if (id.match(/^\d{4}-\d{4}$/)) {
        labelMap[id] = id
      }
    })

    return labelMap
  } catch (error) {
    console.error("[School Year Utils] Error getting school year labels:", error)
    return {}
  }
}
