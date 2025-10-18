
// import { NextResponse } from "next/server"
// import { createServerClient } from "@/lib/supabase/server"
// import { transporter } from "@/lib/email"
// // @ts-ignore
// import QRCode from "qrcode"
// import fs from "fs"
// import path from "path"

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url)
//     const uid = searchParams.get("uid")

//     if (!uid) {
//       return NextResponse.json({ error: "Missing UID parameter" }, { status: 400 })
//     }

//     const supabase = await createServerClient()
//     const { data, error } = await supabase
//       .from("registrations")
//       .select("*")
//       .eq("uid", uid)
//       .maybeSingle()

//     if (error || !data) {
//       return NextResponse.json({ error: "Registration not found" }, { status: 404 })
//     }

//     return NextResponse.json({ data })
//   } catch (err: any) {
//     console.error("❌ GET registration error:", err)
//     return NextResponse.json({ error: "Failed to fetch registration" }, { status: 500 })
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData()
//     const supabase = await createServerClient()

//     const uid = formData.get("uid") as string
//     const type = formData.get("type") as string
//     const purpose = formData.get("purpose") as string
//     const name = formData.get("name") as string
//     const email = formData.get("email") as string
//     const phone = formData.get("phone") as string
//     const college = formData.get("college") as string
//     const degree = formData.get("degree") as string
//     const graduationYear = formData.get("graduationYear") as string
//     const experienceYears = formData.get("experienceYears") as string
//     const referredBy = formData.get("referredBy") as string
//     const portfolioUrl = formData.get("portfolioUrl") as string
//     const githubUrl = formData.get("githubUrl") as string
//     const skills = formData.get("skills") as string
//     const notes = formData.get("notes") as string
//     const photo = formData.get("photo") as File | null
//     const resume = formData.get("resume") as File | null

//     let photo_url: string | null = null
//     let resume_url: string | null = null

//     // ✅ Upload photo to Supabase
//     if (photo) {
//       const photoBuffer = Buffer.from(await photo.arrayBuffer())
//       const photoPath = `submissions/${uid}/photo_${Date.now()}.png`
//       const { error: uploadError } = await supabase.storage
//         .from("uploads")
//         .upload(photoPath, photoBuffer, { contentType: photo.type })

//       if (uploadError) throw uploadError
//       const { data: publicUrl } = supabase.storage.from("uploads").getPublicUrl(photoPath)
//       photo_url = publicUrl.publicUrl
//     }

//     // ✅ Upload resume to Supabase
//     if (resume) {
//       const resumeBuffer = Buffer.from(await resume.arrayBuffer())
//       const resumePath = `submissions/${uid}/resume_${Date.now()}.pdf`
//       const { error: uploadError } = await supabase.storage
//         .from("uploads")
//         .upload(resumePath, resumeBuffer, { contentType: resume.type })

//       if (uploadError) throw uploadError
//       const { data: publicUrl } = supabase.storage.from("uploads").getPublicUrl(resumePath)
//       resume_url = publicUrl.publicUrl
//     }

//     // ✅ Save registration in database
//     const { error: insertError } = await supabase.from("registrations").insert([
//       {
//         uid,
//         type,
//         purpose,
//         name,
//         email,
//         phone,
//         college,
//         degree,
//         graduation_year: graduationYear,
//         experience_years: experienceYears,
//         referred_by: referredBy,
//         portfolio_url: portfolioUrl,
//         github_url: githubUrl,
//         skills,
//         notes,
//         photo_url,
//         resume_url,
//       },
//     ])

//     if (insertError) throw insertError

//     // ✅ Generate QR code
//     const qrDataUrl = await QRCode.toDataURL(
//       `${process.env.NEXT_PUBLIC_SITE_URL}/verify/${uid}`,
//       { margin: 1, scale: 6 }
//     )

//     // ✅ Load local logo from /public
//     const logoPath = path.join(process.cwd(), "public", "rwtlogo.png")
//     const logoBuffer = fs.readFileSync(logoPath)

//     // ✅ Send branded confirmation email
//     if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
//       await transporter.sendMail({
//         from: `"Royals Webtech Pvt. Ltd." <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: `Registration Confirmed - ${uid}`,
//         html: `
//           <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 20px; color: #333;">
//             <!-- Header -->
//             <div style="background: #1e3a8a; color: #fff; padding: 15px; border-radius: 8px 8px 0 0; text-align:center;">
//               <img src="cid:companyLogo" alt="Royals Webtech Logo" style="height:50px;margin-bottom:10px;" />
//               <h2 style="margin:0;">Registration Confirmed!</h2>
//             </div>

//             <!-- ID Card -->
//             <div style="background:#fff; padding:20px; border:1px solid #e2e8f0; border-radius:0 0 8px 8px; max-width:500px; margin:auto;">
//               <p>Hi <strong>${name}</strong>,</p>
//               <p>Thank you for registering with <strong>Royals Webtech Pvt. Ltd.</strong></p>
//               <p>Your <strong>${type}</strong> registration has been successfully submitted.</p>

//               <div style="border:1px solid #cbd5e1; border-radius:10px; padding:15px; margin-top:15px; text-align:left;">
//                 <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e5e7eb; padding-bottom:10px;">
//                   <div>
//                     <h3 style="color:#1e3a8a;margin:0;">Royals Webtech Pvt. Ltd.</h3>
//                     <p style="font-size:12px;margin:0;">Registration ID: <strong>${uid}</strong></p>
//                   </div>
//                   ${
//                     photo_url
//                       ? `<img src="${photo_url}" alt="Photo" style="width:70px;height:70px;border-radius:8px;object-fit:cover;border:1px solid #ccc;" />`
//                       : ""
//                   }
//                 </div>

//                 <div style="margin-top:10px;font-size:14px;line-height:1.6;">
//                   <p><strong>Name:</strong> ${name}</p>
//                   <p><strong>Email:</strong> ${email}</p>
//                   <p><strong>Phone:</strong> ${phone}</p>
//                   <p><strong>Purpose:</strong> ${purpose}</p>
//                 </div>

//                 <div style="text-align:center;margin-top:15px;">
//                   <p style="font-size:13px;color:#555;">Scan this QR for verification:</p>
//                   <img src="cid:qrCode" alt="QR Code" style="width:120px;height:120px;" />
//                 </div>
//               </div>

//               <p style="font-size:13px;color:#555;text-align:center;margin-top:20px;">
//                 Please save this ID for your records.<br/>
//                 You can verify your registration anytime.
//               </p>

//               <p style="text-align:center;font-size:12px;color:#999;">
//                 © 2025 Royals Webtech Pvt. Ltd. All rights reserved.
//               </p>
//             </div>
//           </div>
//         `,
//         attachments: [
//           {
//             filename: "rwtlogo.png",
//             content: logoBuffer,
//             cid: "companyLogo", // ✅ inline logo
//           },
//           {
//             filename: "qrcode.png",
//             path: qrDataUrl,
//             cid: "qrCode", // ✅ inline QR
//           },
//         ],
//       })
//     }

//     return NextResponse.json({ ok: true, uid })
//   } catch (error: any) {
//     console.error("❌ Registration Error:", error)
//     return NextResponse.json(
//       { error: error.message || "Failed to create registration" },
//       { status: 500 }
//     )
//   }
// }

// import { NextResponse } from "next/server"
// import { createServerClient } from "@/lib/supabase/server"
// // @ts-ignore
// import QRCode from "qrcode"
// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData()

//     const uid = formData.get("uid") as string
//     const type = formData.get("type") as string
//     const purpose = formData.get("purpose") as string
//     const name = formData.get("name") as string
//     const email = formData.get("email") as string
//     const phone = formData.get("phone") as string
//     const college = formData.get("college") as string
//     const degree = formData.get("degree") as string
//     const graduationYear = formData.get("graduationYear") as string
//     const experienceYears = formData.get("experienceYears") as string
//     const referredBy = formData.get("referredBy") as string
//     const portfolioUrl = formData.get("portfolioUrl") as string
//     const githubUrl = formData.get("githubUrl") as string
//     const skills = formData.get("skills") as string
//     const notes = formData.get("notes") as string
//     const photo = formData.get("photo") as File | null
//     const resume = formData.get("resume") as File | null

//     const supabase = await createServerClient()

//     // === File Uploads ===
//     let photo_url: string | null = null
//     let resume_url: string | null = null

//     if (photo) {
//       const buffer = Buffer.from(await photo.arrayBuffer())
//       const photoPath = `submissions/${uid}/photo_${Date.now()}.png`
//       const { error } = await supabase.storage.from("uploads").upload(photoPath, buffer, {
//         contentType: photo.type,
//         upsert: false,
//       })
//       if (error) throw error
//       const { data } = supabase.storage.from("uploads").getPublicUrl(photoPath)
//       photo_url = data.publicUrl
//     }

//     if (resume) {
//       const buffer = Buffer.from(await resume.arrayBuffer())
//       const resumePath = `submissions/${uid}/resume_${Date.now()}.pdf`
//       const { error } = await supabase.storage.from("uploads").upload(resumePath, buffer, {
//         contentType: resume.type,
//         upsert: false,
//       })
//       if (error) throw error
//       const { data } = supabase.storage.from("uploads").getPublicUrl(resumePath)
//       resume_url = data.publicUrl
//     }

//     // === Insert into Supabase ===
//     const { error: insertError } = await supabase.from("registrations").insert([
//       {
//         uid,
//         type,
//         purpose,
//         name,
//         email,
//         phone,
//         college,
//         degree,
//         graduation_year: graduationYear,
//         experience_years: experienceYears,
//         referred_by: referredBy,
//         portfolio_url: portfolioUrl,
//         github_url: githubUrl,
//         skills,
//         notes,
//         photo_url,
//         resume_url,
//       },
//     ])

//     if (insertError) throw insertError

//     // === Generate QR Code ===
//     const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/success/${uid}`
//     const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl)

//     // === HTML Email with Logo & ID Card ===
//     const logoUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/rwtlogo.png`

//     const emailHtml = `
//       <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px;">
//         <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
//           <div style="background: linear-gradient(135deg, #1e40af, #1e3a8a); color: white; padding: 15px; text-align: center;">
//             <img src="${logoUrl}" alt="Royals Webtech" style="height: 50px; margin-bottom: 10px;" />
//             <h2 style="margin: 0;">Registration Successful</h2>
//           </div>
//           <div style="padding: 20px; text-align: center;">
//             <h3 style="color: #1e3a8a;">Hi ${name},</h3>
//             <p>Thank you for completing your <strong>${type}</strong> registration with <b>Royals Webtech Pvt. Ltd.</b></p>
//             <div style="border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; background: #f9fafb; margin-top: 15px;">
//               <img src="${photo_url || logoUrl}" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover; margin-bottom: 10px;" />
//               <p style="margin: 5px 0;"><b>ID:</b> ${uid}</p>
//               <p style="margin: 5px 0;"><b>Name:</b> ${name}</p>
//               <p style="margin: 5px 0;"><b>Email:</b> ${email}</p>
//               <p style="margin: 5px 0;"><b>Phone:</b> ${phone}</p>
//               <div style="margin-top: 10px;">
//                 <img src="${qrCodeDataUrl}" alt="QR Code" style="width: 120px; height: 120px;" />
//               </div>
//             </div>
//             <p style="font-size: 13px; color: #555; margin-top: 15px;">
//               You can verify your registration anytime using the above QR Code or the link below:
//             </p>
//             <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; color: white; background: #1e3a8a; border-radius: 5px; text-decoration: none; margin-top: 10px;">
//               View My Registration
//             </a>
//           </div>
//           <div style="background: #1f2937; color: #ccc; padding: 10px; text-align: center; font-size: 12px;">
//             © 2025 Royals Webtech Pvt. Ltd. | All Rights Reserved
//           </div>
//         </div>
//       </div>
//     `

//     // === Send Email via Resend API ===
//     if (process.env.RESEND_API_KEY) {
//       const emailPayload = {
//         from: "Royals Webtech <onboarding@resend.dev>",
//         to: email,
//         subject: `Registration Confirmed - ${uid}`,
//         html: emailHtml,
//       }

//       const resendResponse = await fetch("https://api.resend.com/emails", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(emailPayload),
//       })

//       if (!resendResponse.ok) {
//         const errorText = await resendResponse.text()
//         console.error("❌ Resend email error:", errorText)
//       } else {
//         console.log(`✅ Email sent successfully to ${email}`)
//       }
//     } else {
//       console.warn("⚠️ RESEND_API_KEY missing — skipping email send")
//     }

//     return NextResponse.json({ ok: true, uid })
//   } catch (error: any) {
//     console.error("❌ Registration Error:", error)
//     return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 })
//   }
// }

import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import nodemailer from "nodemailer"
// @ts-ignore
import QRCode from "qrcode"

// ✅ POST — Handles registration, uploads, and sends confirmation email
export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const uid = formData.get("uid") as string
    const type = formData.get("type") as string
    const purpose = formData.get("purpose") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const college = formData.get("college") as string
    const degree = formData.get("degree") as string
    const graduationYear = formData.get("graduationYear") as string
    const experienceYears = formData.get("experienceYears") as string
    const referredBy = formData.get("referredBy") as string
    const portfolioUrl = formData.get("portfolioUrl") as string
    const githubUrl = formData.get("githubUrl") as string
    const skills = formData.get("skills") as string
    const notes = formData.get("notes") as string
    const photo = formData.get("photo") as File | null
    const resume = formData.get("resume") as File | null

    const supabase = await createServerClient()

    let photo_url: string | null = null
    let resume_url: string | null = null

    // ✅ Upload Photo
    if (photo) {
      const buffer = Buffer.from(await photo.arrayBuffer())
      const path = `submissions/${uid}/photo_${Date.now()}.png`
      const { error } = await supabase.storage
        .from("uploads")
        .upload(path, buffer, { contentType: photo.type })
      if (error) throw error
      const { data } = supabase.storage.from("uploads").getPublicUrl(path)
      photo_url = data.publicUrl
    }

    // ✅ Upload Resume
    if (resume) {
      const buffer = Buffer.from(await resume.arrayBuffer())
      const path = `submissions/${uid}/resume_${Date.now()}.pdf`
      const { error } = await supabase.storage
        .from("uploads")
        .upload(path, buffer, { contentType: resume.type })
      if (error) throw error
      const { data } = supabase.storage.from("uploads").getPublicUrl(path)
      resume_url = data.publicUrl
    }

    // ✅ Insert record
    const { error: insertError } = await supabase.from("registrations").insert([
      {
        uid,
        type,
        purpose,
        name,
        email,
        phone,
        college,
        degree,
        graduation_year: graduationYear,
        experience_years: experienceYears,
        referred_by: referredBy,
        portfolio_url: portfolioUrl,
        github_url: githubUrl,
        skills,
        notes,
        photo_url,
        resume_url,
      },
    ])
    if (insertError) throw insertError

    // ✅ Generate QR code for verification
    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/success/${uid}`
    const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, scale: 4 })

    // ✅ Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // ✅ Send email with ID card design
    await transporter.sendMail({
      from: `"Royals Webtech Pvt. Ltd." <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Registration Successful - ${uid}`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 20px; color: #333;">
          <div style="text-align: center;">
            <img src="https://olbgxsroepjjuudgvnxc.supabase.co/storage/v1/object/public/uploads/rwtlogo.png" alt="Royals Webtech Logo" style="width: 120px; margin-bottom: 15px;">
            <h2 style="color: #1e3a8a;">Registration Confirmation</h2>
            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for registering for <strong>${type}</strong> with Royals Webtech Pvt. Ltd.</p>
          </div>

          <div style="background: white; border-radius: 10px; padding: 20px; margin-top: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="text-align: center; color: #1e40af;">Your Registration ID Card</h3>
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px;">
              <div>
                <p><strong>ID:</strong> ${uid}</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
              </div>
              ${
                photo_url
                  ? `<img src="${photo_url}" alt="User Photo" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover; border: 1px solid #ccc;">`
                  : ""
              }
            </div>
            <div style="text-align: center;">
              <p style="font-size: 12px; color: #666;">Scan QR to verify</p>
              <img src="${qrCodeDataUrl}" alt="QR Code" width="120"/>
            </div>
          </div>

          <p style="font-size: 12px; color: #555; margin-top: 20px; text-align: center;">
            © 2025 Royals Webtech Pvt. Ltd. All rights reserved.<br>
            This is an automated email, please do not reply.
          </p>
        </div>
      `,
    })

    console.log(`✅ Confirmation email sent to ${email}`)

    return NextResponse.json({ ok: true, uid })
  } catch (error: any) {
    console.error("❌ Registration Error:", error)
    return NextResponse.json({ error: error.message || "Failed to register" }, { status: 500 })
  }
}
