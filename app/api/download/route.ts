import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/admin"

export async function GET(req: Request) {
  try {
    const supabase = await createServerClient()
    await requireAdmin(supabase)

    const url = new URL(req.url)
    const path = url.searchParams.get("path")

    if (!path) {
      return new NextResponse("Missing path", { status: 400 })
    }

    const { data, error } = await supabase.storage.from("uploads").download(path)

    if (error) {
      return new NextResponse("File not found", { status: 404 })
    }

    const filename = path.split("/").pop() || "download"
    return new NextResponse(data, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": data.type,
      },
    })
  } catch (e: any) {
    return new NextResponse(e?.message || "Download failed", { status: 500 })
  }
}
