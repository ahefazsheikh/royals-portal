
// import { NextResponse } from "next/server"
// import { createServerClient } from "@/lib/supabase/server"
// import { transporter } from "@/lib/email"
// // @ts-ignore
// import QRCode from "qrcode"

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
//       console.error("❌ Registration not found:", error)
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

//     // ✅ Upload Photo
//     if (photo) {
//       const photoBuffer = Buffer.from(await photo.arrayBuffer())
//       const photoPath = `submissions/${uid}/photo_${Date.now()}.png`
//       const { error: uploadPhotoError } = await supabase.storage
//         .from("uploads")
//         .upload(photoPath, photoBuffer, { contentType: photo.type, upsert: false })
//       if (uploadPhotoError) throw uploadPhotoError
//       const { data: publicPhoto } = supabase.storage.from("uploads").getPublicUrl(photoPath)
//       photo_url = publicPhoto.publicUrl
//     }

//     // ✅ Upload Resume
//     if (resume) {
//       const resumeBuffer = Buffer.from(await resume.arrayBuffer())
//       const resumePath = `submissions/${uid}/resume_${Date.now()}.pdf`
//       const { error: uploadResumeError } = await supabase.storage
//         .from("uploads")
//         .upload(resumePath, resumeBuffer, { contentType: resume.type, upsert: false })
//       if (uploadResumeError) throw uploadResumeError
//       const { data: publicResume } = supabase.storage.from("uploads").getPublicUrl(resumePath)
//       resume_url = publicResume.publicUrl
//     }

//     // ✅ Insert Registration
//     const { error: insertError } = await supabase.from("registrations").insert([
//       {
//         uid,
//         type,
//         purpose,
//         name,
//         email,
//         phone,
//         college: college || null,
//         degree: degree || null,
//         graduation_year: graduationYear ? Number(graduationYear) : null,
//         experience_years: experienceYears ? Number(experienceYears) : null,
//         referred_by: referredBy || null,
//         portfolio_url: portfolioUrl || null,
//         github_url: githubUrl || null,
//         skills: skills || null,
//         notes: notes || null,
//         photo_url,
//         resume_url,
//       },
//     ])

//     if (insertError) throw insertError

//     // ✅ Generate QR as a buffer for inline email embedding
//     const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://royalswebtech.com"}/verify/${uid}`
//     const qrBuffer = await QRCode.toBuffer(verifyUrl)

//     // ✅ Send Email with inline CID image for QR + company logo
//     if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
//       await transporter.sendMail({
//         from: `"Royals Webtech Pvt. Ltd." <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: `Registration Confirmed - ${uid}`,
//         html: `
//         <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;background:#f5f7fa;padding:0;">
//           <!-- Header -->
//           <div style="background:#1e3a8a;color:white;padding:16px;text-align:center;border-radius:8px 8px 0 0;">
//             <img src="cid:companyLogo" alt="Royals Webtech Logo" width="180" style="margin-bottom:8px;" />
//             <h2 style="margin:0;">Registration Confirmed!</h2>
//           </div>

//           <!-- ID Card -->
//           <div style="padding:20px;background:#fff;border:1px solid #ddd;max-width:420px;margin:20px auto;border-radius:10px;box-shadow:0 2px 6px rgba(0,0,0,0.1)">
//             <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #ccc;padding-bottom:8px;">
//               <div>
//                 <h3 style="color:#1e3a8a;margin:0;">Royals Webtech Pvt. Ltd.</h3>
//                 <small>ID: ${uid}</small>
//               </div>
//               ${
//                 photo_url
//                   ? `<img src="${photo_url}" width="70" height="70" style="border-radius:8px;object-fit:cover;border:1px solid #ccc;" />`
//                   : `<div style="width:70px;height:70px;border:1px solid #ccc;border-radius:8px;background:#eee;color:#777;font-size:11px;display:flex;align-items:center;justify-content:center;">No Photo</div>`
//               }
//             </div>

//             <div style="margin-top:10px;">
//               <p><strong>Name:</strong> ${name}</p>
//               <p><strong>Email:</strong> ${email}</p>
//               <p><strong>Phone:</strong> ${phone}</p>
//               <p><strong>Purpose:</strong> ${purpose}</p>
//             </div>

//             <div style="text-align:center;margin-top:15px;">
//               <p style="font-size:13px;color:#444;">Scan for verification</p>
//               <img src="cid:qrImage" width="130" height="130" style="border:1px solid #ccc;border-radius:8px;" />
//             </div>
//           </div>

//           <div style="text-align:center;font-size:12px;color:#555;">
//             <p>If you have any questions, contact us at 
//             <a href="mailto:support@royalswebtech.com">support@royalswebtechpvtltd.com</a></p>
//             <p>© 2025 Royals Webtech Pvt. Ltd. All rights reserved.</p>
//           </div>
//         </div>
//         `,
//       attachments: [
//   {
//     filename: "rwtlogo.png",
//     path: "public/rwtlogo.png", // ✅ Local file path
//     cid: "companyLogo",
//   },
//   {
//     filename: "qrcode.png",
//     content: qrBuffer,
//     cid: "qrImage",
//   },
// ],

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
import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { transporter } from "@/lib/email"
// @ts-ignore
import QRCode from "qrcode"
import fs from "fs"
import path from "path"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const uid = searchParams.get("uid")

    if (!uid) {
      return NextResponse.json({ error: "Missing UID parameter" }, { status: 400 })
    }

    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("uid", uid)
      .maybeSingle()

    if (error || !data) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (err: any) {
    console.error("❌ GET registration error:", err)
    return NextResponse.json({ error: "Failed to fetch registration" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const supabase = await createServerClient()

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

    let photo_url: string | null = null
    let resume_url: string | null = null

    // ✅ Upload photo to Supabase
    if (photo) {
      const photoBuffer = Buffer.from(await photo.arrayBuffer())
      const photoPath = `submissions/${uid}/photo_${Date.now()}.png`
      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(photoPath, photoBuffer, { contentType: photo.type })

      if (uploadError) throw uploadError
      const { data: publicUrl } = supabase.storage.from("uploads").getPublicUrl(photoPath)
      photo_url = publicUrl.publicUrl
    }

    // ✅ Upload resume to Supabase
    if (resume) {
      const resumeBuffer = Buffer.from(await resume.arrayBuffer())
      const resumePath = `submissions/${uid}/resume_${Date.now()}.pdf`
      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(resumePath, resumeBuffer, { contentType: resume.type })

      if (uploadError) throw uploadError
      const { data: publicUrl } = supabase.storage.from("uploads").getPublicUrl(resumePath)
      resume_url = publicUrl.publicUrl
    }

    // ✅ Save registration in database
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

    // ✅ Generate QR code
    const qrDataUrl = await QRCode.toDataURL(
      `${process.env.NEXT_PUBLIC_SITE_URL}/verify/${uid}`,
      { margin: 1, scale: 6 }
    )

    // ✅ Load local logo from /public
    const logoPath = path.join(process.cwd(), "public", "rwtlogo.png")
    const logoBuffer = fs.readFileSync(logoPath)

    // ✅ Send branded confirmation email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: `"Royals Webtech Pvt. Ltd." <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Registration Confirmed - ${uid}`,
        html: `
          <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 20px; color: #333;">
            <!-- Header -->
            <div style="background: #1e3a8a; color: #fff; padding: 15px; border-radius: 8px 8px 0 0; text-align:center;">
              <img src="cid:companyLogo" alt="Royals Webtech Logo" style="height:50px;margin-bottom:10px;" />
              <h2 style="margin:0;">Registration Confirmed!</h2>
            </div>

            <!-- ID Card -->
            <div style="background:#fff; padding:20px; border:1px solid #e2e8f0; border-radius:0 0 8px 8px; max-width:500px; margin:auto;">
              <p>Hi <strong>${name}</strong>,</p>
              <p>Thank you for registering with <strong>Royals Webtech Pvt. Ltd.</strong></p>
              <p>Your <strong>${type}</strong> registration has been successfully submitted.</p>

              <div style="border:1px solid #cbd5e1; border-radius:10px; padding:15px; margin-top:15px; text-align:left;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e5e7eb; padding-bottom:10px;">
                  <div>
                    <h3 style="color:#1e3a8a;margin:0;">Royals Webtech Pvt. Ltd.</h3>
                    <p style="font-size:12px;margin:0;">Registration ID: <strong>${uid}</strong></p>
                  </div>
                  ${
                    photo_url
                      ? `<img src="${photo_url}" alt="Photo" style="width:70px;height:70px;border-radius:8px;object-fit:cover;border:1px solid #ccc;" />`
                      : ""
                  }
                </div>

                <div style="margin-top:10px;font-size:14px;line-height:1.6;">
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Phone:</strong> ${phone}</p>
                  <p><strong>Purpose:</strong> ${purpose}</p>
                </div>

                <div style="text-align:center;margin-top:15px;">
                  <p style="font-size:13px;color:#555;">Scan this QR for verification:</p>
                  <img src="cid:qrCode" alt="QR Code" style="width:120px;height:120px;" />
                </div>
              </div>

              <p style="font-size:13px;color:#555;text-align:center;margin-top:20px;">
                Please save this ID for your records.<br/>
                You can verify your registration anytime.
              </p>

              <p style="text-align:center;font-size:12px;color:#999;">
                © 2025 Royals Webtech Pvt. Ltd. All rights reserved.
              </p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: "rwtlogo.png",
            content: logoBuffer,
            cid: "companyLogo", // ✅ inline logo
          },
          {
            filename: "qrcode.png",
            path: qrDataUrl,
            cid: "qrCode", // ✅ inline QR
          },
        ],
      })
    }

    return NextResponse.json({ ok: true, uid })
  } catch (error: any) {
    console.error("❌ Registration Error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create registration" },
      { status: 500 }
    )
  }
}
