import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/admin"
import { transporter } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()
    await requireAdmin(supabase)

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json()
    const { uid, subject, message } = body

    if (!uid || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (subject.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: "Subject or message too long" }, { status: 400 })
    }

    // Get registration details
    const { data: registration, error: regError } = await supabase
      .from("registrations")
      .select("*")
      .eq("uid", uid)
      .maybeSingle()

    if (regError || !registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    // Send email
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail({
          from: `"Royals Webtech Portal" <${process.env.EMAIL_USER}>`,
          to: registration.email,
          subject,
          html: `
            <html>
              <head>
                <meta charset="UTF-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                  .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
                  .footer { background: #1f2937; color: white; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
                  .message { margin: 20px 0; white-space: pre-wrap; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h2>Message from Royals Webtech</h2>
                  </div>
                  <div class="content">
                    <p>Dear <strong>${registration.name}</strong>,</p>
                    <div class="message">${message}</div>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="font-size: 12px; color: #666;">Best regards,<br>Royals Webtech Team</p>
                  </div>
                  <div class="footer">
                    <p>&copy; 2025 Royals Webtech. All rights reserved.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
        })
      }

      // Log communication
      await supabase.from("communication_logs").insert([
        {
          registration_id: registration.id,
          admin_email: user.email,
          subject,
          message,
          status: "sent",
        },
      ])

      // Log audit trail
      await supabase.from("audit_logs").insert([
        {
          admin_email: user.email,
          action: "send_email",
          registration_uid: uid,
          details: { subject },
        },
      ])

      return NextResponse.json({ ok: true, message: "Email sent successfully" })
    } catch (emailError: any) {
      console.error("[v0] Email send failed:", emailError)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }
  } catch (e: any) {
    console.error("[v0] Send email error:", e)
    return NextResponse.json({ error: e?.message || "Failed to send email" }, { status: 500 })
  }
}
