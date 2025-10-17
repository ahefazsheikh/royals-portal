import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/admin"

export async function POST(req: Request) {
  const supabase = await createServerClient()
  await requireAdmin(supabase)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new NextResponse("Unauthorized", { status: 401 })

  const { uid } = await req.json()
  if (!uid) return new NextResponse("Missing uid", { status: 400 })

  const { data: registration } = await supabase.from("registrations").select("*").eq("uid", uid).maybeSingle()

  if (!registration) {
    return NextResponse.json({ ok: false, message: "UID not found" }, { status: 404 })
  }

  const { data, error } = await supabase
    .from("registrations")
    .update({
      checked_in: true,
      checkin_at: new Date().toISOString(),
      status: "checked_in",
    })
    .eq("uid", uid)
    .select("uid")
    .maybeSingle()

  if (error) return new NextResponse(error.message, { status: 500 })

  await supabase.from("audit_logs").insert([
    {
      admin_email: user.email,
      action: "check_in",
      registration_uid: uid,
      details: {
        candidate_name: registration.name,
        candidate_email: registration.email,
      },
    },
  ])

  return NextResponse.json({
    ok: true,
    message: `Checked in ${registration.name}`,
    registration: {
      uid: registration.uid,
      name: registration.name,
      email: registration.email,
      type: registration.type,
    },
  })
}
