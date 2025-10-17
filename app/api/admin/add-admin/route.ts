import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { requireRole } from "@/lib/admin"

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()
    await requireRole(supabase, "director")

    const body = await req.json()
    const { email, role } = body

    if (!email || !role) {
      return new NextResponse("Missing fields", { status: 400 })
    }

    const { data, error } = await supabase.from("admin_emails").insert([{ email, role }]).select().single()

    if (error) {
      return new NextResponse(error.message, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (e: any) {
    return new NextResponse(e?.message || "Failed to add admin", { status: 500 })
  }
}
