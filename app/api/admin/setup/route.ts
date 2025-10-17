import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const { email, password, code } = await req.json()

    if (!email || !password || !code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const expectedCode = process.env.ADMIN_SETUP_CODE || "123456"
    if (code !== expectedCode) {
      return NextResponse.json({ error: "Invalid setup code" }, { status: 401 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Create user if not exists
    const { data: userResp, error: userErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (userErr && userErr.message && !/already exists/i.test(userErr.message)) {
      console.error("[v0] User creation error:", userErr)
      return NextResponse.json({ error: userErr.message }, { status: 500 })
    }

    // Add to admins table with director role
    const { error: insErr } = await supabase
      .from("admins")
      .insert([{ email, role: "director", active: true }])
      .select("email")
      .maybeSingle()

    if (insErr && !/duplicate key|already exists/i.test(insErr.message)) {
      console.error("[v0] Admin insert error:", insErr)
      return NextResponse.json({ error: insErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, message: "Admin created successfully" })
  } catch (e: any) {
    console.error("[v0] Setup error:", e)
    return NextResponse.json({ error: e?.message || "Setup failed" }, { status: 500 })
  }
}
