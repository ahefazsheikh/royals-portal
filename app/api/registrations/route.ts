
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

// import { NextResponse } from "next/server"
// import { createServerClient } from "@/lib/supabase/server"
// import nodemailer from "nodemailer"
// // @ts-ignore
// import QRCode from "qrcode"

// // ✅ POST — Handles registration, uploads, and sends confirmation email
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

//     let photo_url: string | null = null
//     let resume_url: string | null = null

//     // ✅ Upload Photo
//     if (photo) {
//       const buffer = Buffer.from(await photo.arrayBuffer())
//       const path = `submissions/${uid}/photo_${Date.now()}.png`
//       const { error } = await supabase.storage
//         .from("uploads")
//         .upload(path, buffer, { contentType: photo.type })
//       if (error) throw error
//       const { data } = supabase.storage.from("uploads").getPublicUrl(path)
//       photo_url = data.publicUrl
//     }

//     // ✅ Upload Resume
//     if (resume) {
//       const buffer = Buffer.from(await resume.arrayBuffer())
//       const path = `submissions/${uid}/resume_${Date.now()}.pdf`
//       const { error } = await supabase.storage
//         .from("uploads")
//         .upload(path, buffer, { contentType: resume.type })
//       if (error) throw error
//       const { data } = supabase.storage.from("uploads").getPublicUrl(path)
//       resume_url = data.publicUrl
//     }

//     // ✅ Insert record
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

//     // ✅ Generate QR code for verification
//     const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/success/${uid}`
//     const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, scale: 4 })

//     // ✅ Create Nodemailer transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     })

//     // ✅ Send email with ID card design
//     await transporter.sendMail({
//       from: `"Royals Webtech Pvt. Ltd." <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: `Registration Successful - ${uid}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 20px; color: #333;">
//           <div style="text-align: center;">
//             <img src="https://olbgxsroepjjuudgvnxc.supabase.co/storage/v1/object/public/uploads/rwtlogo.png" alt="Royals Webtech Logo" style="width: 120px; margin-bottom: 15px;">
//             <h2 style="color: #1e3a8a;">Registration Confirmation</h2>
//             <p>Dear <strong>${name}</strong>,</p>
//             <p>Thank you for registering for <strong>${type}</strong> with Royals Webtech Pvt. Ltd.</p>
//           </div>

//           <div style="background: white; border-radius: 10px; padding: 20px; margin-top: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
//             <h3 style="text-align: center; color: #1e40af;">Your Registration ID Card</h3>
//             <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px;">
//               <div>
//                 <p><strong>ID:</strong> ${uid}</p>
//                 <p><strong>Name:</strong> ${name}</p>
//                 <p><strong>Email:</strong> ${email}</p>
//                 <p><strong>Phone:</strong> ${phone}</p>
//               </div>
//               ${
//                 photo_url
//                   ? `<img src="${photo_url}" alt="User Photo" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover; border: 1px solid #ccc;">`
//                   : ""
//               }
//             </div>
//             <div style="text-align: center;">
//               <p style="font-size: 12px; color: #666;">Scan QR to verify</p>
//               <img src="${qrCodeDataUrl}" alt="QR Code" width="120"/>
//             </div>
//           </div>

//           <p style="font-size: 12px; color: #555; margin-top: 20px; text-align: center;">
//             © 2025 Royals Webtech Pvt. Ltd. All rights reserved.<br>
//             This is an automated email, please do not reply.
//           </p>
//         </div>
//       `,
//     })

//     console.log(`✅ Confirmation email sent to ${email}`)

//     return NextResponse.json({ ok: true, uid })
//   } catch (error: any) {
//     console.error("❌ Registration Error:", error)
//     return NextResponse.json({ error: error.message || "Failed to register" }, { status: 500 })
//   }
// }

// import { NextResponse } from "next/server"
// import { createServerClient } from "@/lib/supabase/server"
// import nodemailer from "nodemailer"
// // @ts-ignore
// import QRCode from "qrcode"

// /** Convert any image (logo or uploaded photo) to Base64 for inline embedding */
// async function imageToBase64(url: string) {
//   try {
//     const response = await fetch(url)
//     const buffer = Buffer.from(await response.arrayBuffer())
//     const base64 = buffer.toString("base64")
//     const mime = response.headers.get("content-type") || "image/png"
//     return `data:${mime};base64,${base64}`
//   } catch (e) {
//     console.error("⚠️ Failed to embed image:", url, e)
//     return null
//   }
// }

// /** ✅ POST — Handles registration, uploads & sends confirmation email */
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

//     let photo_url: string | null = null
//     let resume_url: string | null = null

//     // ✅ Upload Photo
//     if (photo) {
//       const buffer = Buffer.from(await photo.arrayBuffer())
//       const path = `submissions/${uid}/photo_${Date.now()}.png`
//       const { error } = await supabase.storage
//         .from("uploads")
//         .upload(path, buffer, { contentType: photo.type })
//       if (error) throw error
//       const { data } = supabase.storage.from("uploads").getPublicUrl(path)
//       photo_url = data.publicUrl
//     }

//     // ✅ Upload Resume
//     if (resume) {
//       const buffer = Buffer.from(await resume.arrayBuffer())
//       const path = `submissions/${uid}/resume_${Date.now()}.pdf`
//       const { error } = await supabase.storage
//         .from("uploads")
//         .upload(path, buffer, { contentType: resume.type })
//       if (error) throw error
//       const { data } = supabase.storage.from("uploads").getPublicUrl(path)
//       resume_url = data.publicUrl
//     }

//     // ✅ Insert record
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
//     const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/success/${uid}`
//     const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, scale: 4 })

//     // ✅ Embed images inline (base64)
//     const logoBase64 = await imageToBase64(
//       "https://olbgxsroepjjuudgvnxc.supabase.co/storage/v1/object/public/uploads/rwtlogo.png"
//     )
//     const userPhotoBase64 = photo_url ? await imageToBase64(photo_url) : null
//     const qrBase64 = qrCodeDataUrl

//     // ✅ Configure transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     })

//     // ✅ Send email
//     await transporter.sendMail({
//       from: `"Royals Webtech Pvt. Ltd." <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: `Registration Successful - ${uid}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 20px; color: #333;">
//           <div style="text-align: center;">
//             ${
//               logoBase64
//                 ? `<img src="${logoBase64}" alt="Royals Webtech Logo" style="width: 180px; margin-bottom: 10px;">`
//                 : ""
//             }
//             <h2 style="color: #1e3a8a; margin-bottom: 10px;">Registration Confirmation</h2>
//             <p>Dear <strong>${name}</strong>,</p>
//             <p>Thank you for registering for <strong>${type}</strong> with Royals Webtech Pvt. Ltd.</p>
//           </div>

//           <div style="background: white; border-radius: 10px; padding: 20px; margin-top: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
//             <h3 style="text-align: center; color: #1e40af;">Your Registration ID Card</h3>
//             <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px;">
//               <div>
//                 <p><strong>ID:</strong> ${uid}</p>
//                 <p><strong>Name:</strong> ${name}</p>
//                 <p><strong>Email:</strong> ${email}</p>
//                 <p><strong>Phone:</strong> ${phone}</p>
//               </div>
//               ${
//                 userPhotoBase64
//                   ? `<img src="${userPhotoBase64}" alt="User Photo" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover; border: 1px solid #ccc;">`
//                   : ""
//               }
//             </div>
//             <div style="text-align: center;">
//               <p style="font-size: 12px; color: #666;">Scan QR to verify</p>
//               <img src="${qrBase64}" alt="QR Code" width="120"/>
//             </div>
//           </div>

//           <p style="font-size: 12px; color: #555; margin-top: 20px; text-align: center;">
//             © 2025 Royals Webtech Pvt. Ltd. All rights reserved.<br>
//             This is an automated email, please do not reply.
//           </p>
//         </div>
//       `,
//     })

//     console.log(`✅ Confirmation email sent to ${email}`)

//     return NextResponse.json({ ok: true, uid })
//   } catch (error: any) {
//     console.error("❌ Registration Error:", error)
//     return NextResponse.json({ error: error.message || "Failed to register" }, { status: 500 })
//   }
// }

// /** ✅ GET — Fetch single registration by UID for /success/[uid] */
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

//     if (error) {
//       console.error("❌ Supabase fetch error:", error.message)
//       return NextResponse.json({ error: error.message }, { status: 500 })
//     }

//     if (!data) {
//       console.warn("⚠️ No registration found for UID:", uid)
//       return NextResponse.json({ error: "Registration not found" }, { status: 404 })
//     }

//     console.log("✅ Registration found:", data)
//     return NextResponse.json({ data })
//   } catch (err: any) {
//     console.error("❌ GET registration error:", err)
//     return NextResponse.json(
//       { error: err?.message || "Failed to fetch registration" },
//       { status: 500 }
//     )
//   }
// }

// import { NextResponse } from "next/server"
// import { createServerClient } from "@/lib/supabase/server"
// import nodemailer from "nodemailer"
// // @ts-ignore
// import QRCode from "qrcode"

// /** ✅ Helper: Convert image URL to buffer (for email CID attachment) */
// async function fetchImageBuffer(url: string) {
//   try {
//     const res = await fetch(url)
//     const buffer = Buffer.from(await res.arrayBuffer())
//     const mime = res.headers.get("content-type") || "image/png"
//     return { buffer, mime }
//   } catch (e) {
//     console.error("⚠️ Failed to fetch image:", url, e)
//     return null
//   }
// }

// /** ✅ POST — Handles registration, uploads, and sends confirmation email */
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

//     let photo_url: string | null = null
//     let resume_url: string | null = null

//     // ✅ Upload Photo
//     if (photo) {
//       const buffer = Buffer.from(await photo.arrayBuffer())
//       const path = `submissions/${uid}/photo_${Date.now()}.png`
//       const { error } = await supabase.storage
//         .from("uploads")
//         .upload(path, buffer, { contentType: photo.type })
//       if (error) throw error
//       const { data } = supabase.storage.from("uploads").getPublicUrl(path)
//       photo_url = data.publicUrl
//     }

//     // ✅ Upload Resume
//     if (resume) {
//       const buffer = Buffer.from(await resume.arrayBuffer())
//       const path = `submissions/${uid}/resume_${Date.now()}.pdf`
//       const { error } = await supabase.storage
//         .from("uploads")
//         .upload(path, buffer, { contentType: resume.type })
//       if (error) throw error
//       const { data } = supabase.storage.from("uploads").getPublicUrl(path)
//       resume_url = data.publicUrl
//     }

//     // ✅ Insert record
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

//     // ✅ Generate QR Code
//     const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/success/${uid}`
//     const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, scale: 4 })
//     const qrBase64 = qrCodeDataUrl.split(",")[1]
//     const qrBuffer = Buffer.from(qrBase64, "base64")

//     // ✅ Fetch images
//     const logo = await fetchImageBuffer(
//       "https://olbgxsroepjjuudgvnxc.supabase.co/storage/v1/object/public/uploads/rwtlogo.png"
//     )
//     const userPhoto = photo_url ? await fetchImageBuffer(photo_url) : null

//     // ✅ Create mail transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     })

//     // ✅ Responsive + Dark Mode friendly email
//     const htmlTemplate = `
//       <html>
//       <head>
//         <meta name="color-scheme" content="light dark">
//         <style>
//           body {
//             font-family: Arial, sans-serif;
//             background: #f9fafb;
//             color: #333;
//             margin: 0;
//             padding: 0;
//           }
//           @media (prefers-color-scheme: dark) {
//             body { background: #121212; color: #f1f1f1; }
//             .card { background: #1e1e1e !important; color: #fff !important; }
//           }
//           .container {
//             max-width: 600px;
//             margin: 0 auto;
//             background: #fff;
//             border-radius: 12px;
//             overflow: hidden;
//             box-shadow: 0 4px 20px rgba(0,0,0,0.1);
//           }
//           .header {
//             background: linear-gradient(90deg, #1e3a8a, #1e40af);
//             color: white;
//             text-align: center;
//             padding: 20px;
//           }
//           .content {
//             padding: 20px;
//           }
//           .id-card {
//             border: 1px solid #ddd;
//             border-radius: 8px;
//             padding: 15px;
//             background: #f8fafc;
//           }
//           .id-photo {
//             width: 80px;
//             height: 80px;
//             border-radius: 8px;
//             object-fit: cover;
//             border: 1px solid #ccc;
//           }
//           .qr {
//             margin-top: 10px;
//           }
//           .footer {
//             text-align: center;
//             font-size: 12px;
//             padding: 15px;
//             color: #777;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <img src="cid:logo" alt="Royals Webtech Logo" style="width: 150px; margin-bottom: 10px;">
//             <h2>Registration Confirmed!</h2>
//           </div>

//           <div class="content">
//             <p>Dear <strong>${name}</strong>,</p>
//             <p>Thank you for registering for <strong>${type}</strong> with Royals Webtech Pvt. Ltd.</p>

//             <div class="id-card">
//               <h3 style="text-align:center; color:#1e40af;">Your Registration ID Card</h3>
//               <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #ddd; padding-bottom:10px;">
//                 <div>
//                   <p><strong>ID:</strong> ${uid}</p>
//                   <p><strong>Name:</strong> ${name}</p>
//                   <p><strong>Email:</strong> ${email}</p>
//                   <p><strong>Phone:</strong> ${phone}</p>
//                 </div>
//                 ${
//                   userPhoto
//                     ? `<img src="cid:userphoto" alt="User Photo" class="id-photo" />`
//                     : ""
//                 }
//               </div>

//               <div class="qr" style="text-align:center;">
//                 <p style="font-size:12px;">Scan QR to verify</p>
//                 <img src="cid:qrcode" alt="QR Code" width="120"/>
//               </div>
//             </div>

//             <p style="margin-top:20px; font-size:12px; text-align:center;">
//               Please keep this ID safe. You can verify your registration using the QR code above.
//             </p>
//           </div>

//           <div class="footer">
//             © 2025 Royals Webtech Pvt. Ltd. All rights reserved.<br>
//             This is an automated email. Please do not reply.
//           </div>
//         </div>
//       </body>
//       </html>
//     `

//     // ✅ Send email with inline CIDs
//     await transporter.sendMail({
//       from: `"Royals Webtech Pvt. Ltd." <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: `Registration Successful - ${uid}`,
//       html: htmlTemplate,
//       attachments: [
//         ...(logo
//           ? [
//               {
//                 filename: "logo.png",
//                 content: logo.buffer,
//                 cid: "logo",
//                 contentType: logo.mime,
//               },
//             ]
//           : []),
//         ...(userPhoto
//           ? [
//               {
//                 filename: "photo.png",
//                 content: userPhoto.buffer,
//                 cid: "userphoto",
//                 contentType: userPhoto.mime,
//               },
//             ]
//           : []),
//         {
//           filename: "qrcode.png",
//           content: qrBuffer,
//           cid: "qrcode",
//           contentType: "image/png",
//         },
//       ],
//     })

//     console.log(`✅ Confirmation email sent to ${email}`)
//     return NextResponse.json({ ok: true, uid })
//   } catch (error: any) {
//     console.error("❌ Registration Error:", error)
//     return NextResponse.json({ error: error.message || "Failed to register" }, { status: 500 })
//   }
// }

// /** ✅ GET — Fetch registration for success page */
// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url)
//     const uid = searchParams.get("uid")

//     if (!uid) return NextResponse.json({ error: "Missing UID parameter" }, { status: 400 })

//     const supabase = await createServerClient()
//     const { data, error } = await supabase
//       .from("registrations")
//       .select("*")
//       .eq("uid", uid)
//       .maybeSingle()

//     if (error) throw error
//     if (!data) return NextResponse.json({ error: "Registration not found" }, { status: 404 })

//     return NextResponse.json({ data })
//   } catch (err: any) {
//     console.error("❌ GET registration error:", err)
//     return NextResponse.json(
//       { error: err?.message || "Failed to fetch registration" },
//       { status: 500 }
//     )
//   }
// }
import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import nodemailer from "nodemailer"
import fs from "fs"
import path from "path"
// @ts-ignore
import QRCode from "qrcode"

/** Helper to fetch any public image as a buffer */
async function fetchImageBuffer(url: string) {
  try {
    const res = await fetch(url)
    const buffer = Buffer.from(await res.arrayBuffer())
    const mime = res.headers.get("content-type") || "image/png"
    return { buffer, mime }
  } catch (e) {
    console.error("⚠️ Failed to fetch image:", url, e)
    return null
  }
}

/** ✅ POST — Registration submission, upload, and email confirmation */
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

    // ✅ Upload photo
    if (photo) {
      const buffer = Buffer.from(await photo.arrayBuffer())
      const pathInBucket = `submissions/${uid}/photo_${Date.now()}.png`
      const { error } = await supabase.storage
        .from("uploads")
        .upload(pathInBucket, buffer, { contentType: photo.type })
      if (error) throw error
      const { data } = supabase.storage.from("uploads").getPublicUrl(pathInBucket)
      photo_url = data.publicUrl
    }

    // ✅ Upload resume
    if (resume) {
      const buffer = Buffer.from(await resume.arrayBuffer())
      const pathInBucket = `submissions/${uid}/resume_${Date.now()}.pdf`
      const { error } = await supabase.storage
        .from("uploads")
        .upload(pathInBucket, buffer, { contentType: resume.type })
      if (error) throw error
      const { data } = supabase.storage.from("uploads").getPublicUrl(pathInBucket)
      resume_url = data.publicUrl
    }

    // ✅ Save registration
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

    // ✅ Generate QR Code
    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/success/${uid}`
    const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, scale: 4 })
    const qrBase64 = qrCodeDataUrl.split(",")[1]
    const qrBuffer = Buffer.from(qrBase64, "base64")

    // ✅ Fetch local logo from public folder
    const logoPath = path.join(process.cwd(), "public", "rwtlogo.png")
    const logoBuffer = fs.existsSync(logoPath) ? fs.readFileSync(logoPath) : null

    // ✅ Fetch user photo
    const userPhoto = photo_url ? await fetchImageBuffer(photo_url) : null

    // ✅ Mail setup------------------------------------
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // })
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,          // SSL port
  secure: true,       // use SSL directly
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // your 16-digit Gmail App Password
  },
})
    // ✅ Responsive, dark-mode safe HTML email
    const html = `
    <html>
    <head>
      <meta name="color-scheme" content="light dark">
      <style>
        body {
          font-family: Arial, sans-serif;
          background: #f9fafb;
          color: #333;
          margin: 0;
          padding: 0;
        }
        @media (prefers-color-scheme: dark) {
          body { background: #121212; color: #f1f1f1; }
          .card { background: #1e1e1e !important; color: #fff !important; }
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .header {
          background: #1e3a8a;
          color: white;
          text-align: center;
          padding: 25px;
        }
        .header img {
          width: 180px;
          display: block;
          margin: 0 auto 10px auto;
        }
        .content { padding: 20px; }
        .id-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          background: #f8fafc;
        }
        .id-photo {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid #ccc;
        }
        .qr { margin-top: 10px; }
        .footer {
          text-align: center;
          font-size: 12px;
          padding: 15px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="cid:rwt_logo" alt="Royals Webtech Pvt. Ltd.">
          <h2>Registration Confirmed!</h2>
        </div>

        <div class="content">
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for registering for <strong>${type}</strong> with Royals Webtech Pvt. Ltd.</p>

          <div class="id-card">
            <h3 style="text-align:center; color:#1e40af;">Your Registration ID Card</h3>
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #ddd; padding-bottom:10px;">
              <div>
                <p><strong>ID:</strong> ${uid}</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
              </div>
              ${
                userPhoto
                  ? `<img src="cid:userphoto" alt="User Photo" class="id-photo" />`
                  : ""
              }
            </div>

            <div class="qr" style="text-align:center;">
              <p style="font-size:12px;">Scan QR to verify</p>
              <img src="cid:qrcode" alt="QR Code" width="120"/>
            </div>
          </div>

          <p style="margin-top:20px; font-size:12px; text-align:center;">
            Please keep this ID safe. You can verify your registration using the QR code above.
          </p>
        </div>

        <div class="footer">
          © 2025 Royals Webtech Pvt. Ltd. All rights reserved.<br>
          This is an automated email. Please do not reply.
        </div>
      </div>
    </body>
    </html>
    `

    await transporter.sendMail({
      from: `"Royals Webtech Pvt. Ltd." <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Registration Successful - ${uid}`,
      html,
      attachments: [
        ...(logoBuffer
          ? [
              {
                filename: "rwtlogo.png",
                content: logoBuffer,
                cid: "rwt_logo",
                encoding: "base64",
                contentType: "image/png",
              },
            ]
          : []),
        ...(userPhoto
          ? [
              {
                filename: "photo.png",
                content: userPhoto.buffer,
                cid: "userphoto",
                encoding: "base64",
                contentType: userPhoto.mime || "image/png",
              },
            ]
          : []),
        {
          filename: "qrcode.png",
          content: qrBuffer,
          cid: "qrcode",
          encoding: "base64",
          contentType: "image/png",
        },
      ],
    })

    console.log(`✅ Confirmation email sent to ${email}`)
    return NextResponse.json({ ok: true, uid })
  } catch (error: any) {
    console.error("❌ Registration Error:", error)
    return NextResponse.json({ error: error.message || "Failed to register" }, { status: 500 })
  }
}

/** ✅ GET — Fetch registration for success page */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const uid = searchParams.get("uid")

    if (!uid) return NextResponse.json({ error: "Missing UID parameter" }, { status: 400 })

    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("uid", uid)
      .maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ error: "Registration not found" }, { status: 404 })

    return NextResponse.json({ data })
  } catch (err: any) {
    console.error("❌ GET registration error:", err)
    return NextResponse.json(
      { error: err?.message || "Failed to fetch registration" },
      { status: 500 }
    )
  }
}

