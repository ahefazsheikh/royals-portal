// import { NextResponse } from "next/server"
// import { createServerClient } from "@/lib/supabase/server"
// import { requireAdmin } from "@/lib/admin"

// // ✅ Fetch registrations (with filters)
// export async function GET(req: Request) {
//   const supabase = await createServerClient()
//   await requireAdmin(supabase)

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()
//   if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//   const url = new URL(req.url)
//   const q = url.searchParams.get("q") || ""
//   const type = url.searchParams.get("type") || ""
//   const status = url.searchParams.get("status") || ""
//   const limit = Math.min(Number(url.searchParams.get("limit") || 200), 500)
//   const from = Number(url.searchParams.get("from") || 0)

//   let query = supabase
//     .from("registrations")
//     .select("*", { count: "exact" })
//     .order("created_at", { ascending: false })

//   if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`)
//   if (type) query = query.eq("type", type)
//   if (status) query = query.eq("status", status)

//   query = query.range(from, from + (limit - 1))

//   const { data, error, count } = await query
//   if (error) return NextResponse.json({ error: error.message }, { status: 500 })

//   return NextResponse.json({ data, count })
// }

// // ✅ Update registration (check-in/status change)
// export async function PATCH(req: Request) {
//   const supabase = await createServerClient()
//   await requireAdmin(supabase)

//   const {
//     data: { user },
//   } = await supabase.auth.getUser()
//   if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//   const body = await req.json()
//   const uid = body?.uid as string
//   if (!uid) return NextResponse.json({ error: "uid is required" }, { status: 400 })

//   const update: Record<string, any> = {}

//   // ✅ Check-in logic
//   if (typeof body?.checked_in === "boolean") {
//     update.checked_in = !!body.checked_in
//     update.checkin_at = body.checked_in ? new Date().toISOString() : null
//   }

//   // ✅ Status validation
//   if (typeof body?.status === "string") {
//     const allowed = ["new", "reviewing", "shortlisted", "rejected", "hired", "checked_in"]
//     if (!allowed.includes(body.status)) {
//       return NextResponse.json({ error: "Invalid status" }, { status: 400 })
//     }
//     update.status = body.status
//   }

//   if (Object.keys(update).length === 0) {
//     return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
//   }

//   // ✅ Audit Log entry
//   await supabase.from("audit_logs").insert([
//     {
//       admin_email: user.email,
//       action: "update_registration",
//       registration_uid: uid,
//       details: { changes: update },
//     },
//   ])

//   // ✅ Update main table
//   const { error } = await supabase.from("registrations").update(update).eq("uid", uid)
//   if (error) return NextResponse.json({ error: error.message }, { status: 500 })

//   return NextResponse.json({ ok: true })
// }

import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/admin"

// ✅ Get all registrations (for Admin Dashboard)
export async function GET(req: Request) {
  try {
    const supabase = await createServerClient()
    await requireAdmin(supabase)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const url = new URL(req.url)
    const q = url.searchParams.get("q") || ""
    const type = url.searchParams.get("type") || ""
    const status = url.searchParams.get("status") || ""
    const limit = Math.min(Number(url.searchParams.get("limit") || 200), 500)
    const from = Number(url.searchParams.get("from") || 0)

    let query = supabase
      .from("registrations")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })

    if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`)
    if (type) query = query.eq("type", type)
    if (status) query = query.eq("status", status)

    query = query.range(from, from + (limit - 1))

    const { data, error, count } = await query
    if (error) {
      console.error("❌ Supabase GET error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, count })
  } catch (err: any) {
    console.error("❌ GET /api/admin/registrations error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ✅ Update registration record (status / check-in)
export async function PATCH(req: Request) {
  try {
    const supabase = await createServerClient()
    await requireAdmin(supabase)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const uid = body?.uid as string
    if (!uid) return NextResponse.json({ error: "uid is required" }, { status: 400 })

    const update: Record<string, any> = {}

    // ✅ Check-in logic
    if (typeof body?.checked_in === "boolean") {
      update.checked_in = !!body.checked_in
      update.checkin_at = body.checked_in ? new Date().toISOString() : null
    }

    // ✅ Status validation
    if (typeof body?.status === "string") {
      const allowed = ["new", "reviewing", "shortlisted", "rejected", "hired", "checked_in", "pending"]
      if (!allowed.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 })
      }
      update.status = body.status
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
    }

    // ✅ Audit Log Entry
    await supabase.from("audit_logs").insert([
      {
        admin_email: user.email,
        action: "update_registration",
        registration_uid: uid,
        details: { changes: update },
      },
    ])

    // ✅ Update Registration Record
    const { data, error } = await supabase
      .from("registrations")
      .update(update)
      .eq("uid", uid)
      .select("*") // fetch updated record

    console.log("🧠 PATCH update result:", { uid, update, error, data })

    if (error) {
      console.error("❌ Supabase update error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // ✅ Return updated data for debugging
    return NextResponse.json({ ok: true, updated: data })
  } catch (err: any) {
    console.error("❌ PATCH /api/admin/registrations error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
