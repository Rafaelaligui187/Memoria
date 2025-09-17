import { type NextRequest, NextResponse } from "next/server"

interface YearSettings {
  yearId: string
  privacy: {
    defaultProfileVisibility: "public" | "private" | "hidden"
    allowPublicGallery: boolean
    requireApprovalForProfiles: boolean
    requireApprovalForAlbums: boolean
  }
  moderation: {
    autoApproveReturningUsers: boolean
    moderationTimeout: number
    enableBulkActions: boolean
  }
  notifications: {
    emailOnApproval: boolean
    emailOnRejection: boolean
    inAppNotifications: boolean
  }
  rejectionReasons: string[]
  updatedAt: string
}

// Mock settings storage
const yearSettings: Record<string, YearSettings> = {}

export async function GET(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const settings = yearSettings[params.yearId] || {
      yearId: params.yearId,
      privacy: {
        defaultProfileVisibility: "public" as const,
        allowPublicGallery: true,
        requireApprovalForProfiles: true,
        requireApprovalForAlbums: false,
      },
      moderation: {
        autoApproveReturningUsers: false,
        moderationTimeout: 7,
        enableBulkActions: true,
      },
      notifications: {
        emailOnApproval: true,
        emailOnRejection: true,
        inAppNotifications: true,
      },
      rejectionReasons: [
        "Inappropriate content",
        "Incomplete information",
        "Image quality issues",
        "Duplicate submission",
        "Policy violation",
        "Requires additional verification",
      ],
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch year settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { yearId: string } }) {
  try {
    const body = await request.json()

    const settings: YearSettings = {
      ...body,
      yearId: params.yearId,
      updatedAt: new Date().toISOString(),
    }

    yearSettings[params.yearId] = settings

    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update year settings" }, { status: 500 })
  }
}
