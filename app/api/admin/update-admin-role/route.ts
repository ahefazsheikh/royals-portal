import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { requireRole } from "@/lib/admin"

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()
    await requireRole(supabase, "director")

    const body = await req.json()
    const { id, role } = body

    if (!id || !role) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    const { error } = await supabase.from("admin_emails").update({ role }).eq("id", id)

    if (error) {
      return new NextResponse(error.message, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return new NextResponse(e?.message || "Failed to update role", { status: 500 })
  }
}
