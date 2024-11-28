import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const reports = await prisma.data_table_v2.findMany({
      select: {
        id: true,
        title: true,
        md5_hash: true,
        created_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error("Failed to fetch reports:", error)
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    )
  }
}