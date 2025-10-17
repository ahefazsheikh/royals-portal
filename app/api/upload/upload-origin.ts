// import { type NextRequest, NextResponse } from "next/server"
// import { createServerClient } from "@/lib/supabase/server"

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData()
//     const file = formData.get("file") as File

//     if (!file) {
//       return NextResponse.json({ error: "No file provided" }, { status: 400 })
//     }

//     const supabase = await createServerClient()
//     const arrayBuffer = await file.arrayBuffer()
//     const buffer = Buffer.from(arrayBuffer)
//     const filename = `${Date.now()}_${file.name}`

//     // Upload to Supabase storage in bucket 'uploads'
//     const { data, error } = await supabase.storage
//       .from('uploads')
//       .upload(filename, buffer, {
//         contentType: file.type,
//         upsert: false,
//       })

//     if (error) {
//       console.error('Supabase upload error:', error)
//       return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
//     }

//     const { publicURL, error: urlError } = supabase.storage.from('uploads').getPublicUrl(data.path)
//     if (urlError) {
//       return NextResponse.json({ error: 'Failed to get public URL' }, { status: 500 })
//     }

//     return NextResponse.json({
//       url: publicURL,
//       filename,
//       size: file.size,
//       type: file.type,
//     })
//   } catch (error) {
//     console.error("Upload error:", error)
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 })
//   }
// }


// import { type NextRequest, NextResponse } from "next/server"
// import { createServerClient } from "@/lib/supabase/server"

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData()

//     // ✅ Accept multiple possible field names (file, photo, resume)
//     const file =
//       (formData.get("file") as File) ||
//       (formData.get("photo") as File) ||
//       (formData.get("resume") as File)

//     if (!file) {
//       console.error("❌ No file provided in formData keys:", Array.from(formData.keys()))
//       return NextResponse.json({ error: "No file provided" }, { status: 400 })
//     }

//     // ✅ Initialize Supabase client
//     const supabase = await createServerClient()

//     console.log("🧠 Starting file upload:", {
//       name: file.name,
//       type: file.type,
//       size: file.size,
//     })

//     // ✅ Convert file to buffer
//     const arrayBuffer = await file.arrayBuffer()
//     const buffer = Buffer.from(arrayBuffer)
//     const filename = `${Date.now()}_${file.name}`

//     // ✅ Upload to Supabase Storage (bucket: uploads)
//     const { data, error } = await supabase.storage
//       .from("uploads")
//       .upload(filename, buffer, {
//         contentType: file.type,
//         upsert: false,
//       })

//     if (error) {
//       console.error("❌ Supabase upload error:", error.message)
//       return NextResponse.json(
//         { error: `Upload failed: ${error.message}` },
//         { status: 500 }
//       )
//     }

//     console.log("✅ File uploaded successfully:", data)

//     // ✅ Retrieve public URL safely
//     const { data: publicUrlData, error: urlError }: any = supabase
//       .storage
//       .from("uploads")
//       .getPublicUrl(data.path)

//     if (urlError) {
//       console.error("❌ Failed to get public URL:", urlError)
//       return NextResponse.json({ error: "Failed to get public URL" }, { status: 500 })
//     }

//     const publicURL = publicUrlData?.publicUrl as string

//     console.log("🌐 File accessible at:", publicURL)

//     // ✅ Respond with upload details
//     return NextResponse.json({
//       url: publicURL,
//       filename,
//       size: file.size,
//       type: file.type,
//     })
//   } catch (error: any) {
//     console.error("❌ Upload error:", error)
//     return NextResponse.json(
//       { error: "File upload failed for photo" },
//       { status: 400 }
//     )
//   }
// }


// import { type NextRequest, NextResponse } from "next/server"
// import { createServerClient } from "@/lib/supabase/server"

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData()

//     // ✅ Accept multiple field names (file, photo, resume)
//     const file =
//       (formData.get("file") as File) ||
//       (formData.get("photo") as File) ||
//       (formData.get("resume") as File)

//     if (!file) {
//       console.error("❌ No file provided in formData keys:", Array.from(formData.keys()))
//       return NextResponse.json({ error: "No file provided" }, { status: 400 })
//     }

//     // ✅ Optional: get custom folder path from formData (e.g., submissions/RWT-INT-251017-50NV)
//     const folder = (formData.get("folder") as string) || ""

//     const supabase = await createServerClient()
//     const arrayBuffer = await file.arrayBuffer()
//     const buffer = Buffer.from(arrayBuffer)

//     // ✅ Preserve folder structure in filename
//     const filename = folder ? `${folder}/${file.name}` : file.name

//     // ✅ Upload to Supabase Storage
//     const { data, error } = await supabase.storage
//       .from("uploads")
//       .upload(filename, buffer, {
//         contentType: file.type,
//         upsert: true,
//       })

//     if (error) {
//       console.error("❌ Supabase upload error:", error.message)
//       return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 })
//     }

//     // ✅ Return full public URL (includes subfolder)
//     const { data: publicUrlData, error: urlError }: any = supabase
//       .storage
//       .from("uploads")
//       .getPublicUrl(data.path)

//     if (urlError) {
//       console.error("❌ Failed to get public URL:", urlError)
//       return NextResponse.json({ error: "Failed to get public URL" }, { status: 500 })
//     }

//     const publicURL = publicUrlData?.publicUrl as string

//     console.log("✅ File uploaded successfully:", { publicURL })

//     return NextResponse.json({
//       url: publicURL,
//       filename,
//       size: file.size,
//       type: file.type,
//     })
//   } catch (error) {
//     console.error("❌ Upload error:", error)
//     return NextResponse.json({ error: "File upload failed" }, { status: 400 })
//   }
// }

// import { type NextRequest, NextResponse } from "next/server"
// import { createServerClient } from "@/lib/supabase/server"

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData()

//     // ✅ Accept multiple field names (photo, resume, file)
//     const file =
//       (formData.get("file") as File) ||
//       (formData.get("photo") as File) ||
//       (formData.get("resume") as File)

//     if (!file) {
//       console.error("❌ No file found in formData. Keys received:", Array.from(formData.keys()))
//       return NextResponse.json({ error: "No file provided" }, { status: 400 })
//     }

//     // ✅ Optional: folder field (e.g., submissions/RWT-INT-251017-50NV)
//     const folder = (formData.get("folder") as string) || ""

//     const supabase = await createServerClient()

//     const arrayBuffer = await file.arrayBuffer()
//     const buffer = Buffer.from(arrayBuffer)

//     // ✅ Build final file path (with folder if provided)
//     const filename = folder ? `${folder}/${file.name}` : file.name

//     // ✅ Upload to Supabase storage
//     const { data, error } = await supabase.storage
//       .from("uploads")
//       .upload(filename, buffer, {
//         contentType: file.type,
//         upsert: true, // overwrite if already exists
//       })

//     if (error) {
//       console.error("❌ Supabase upload error:", error.message)
//       return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 })
//     }

//     // ✅ Generate a public URL that includes the full folder path
//     const { data: publicUrlData, error: urlError }: any = supabase
//       .storage
//       .from("uploads")
//       .getPublicUrl(filename)

//     if (urlError) {
//       console.error("❌ Failed to generate public URL:", urlError)
//       return NextResponse.json({ error: "Failed to get public URL" }, { status: 500 })
//     }

//     const publicURL = publicUrlData?.publicUrl as string

//     console.log("✅ File uploaded successfully:", {
//       path: filename,
//       url: publicURL,
//       size: file.size,
//       type: file.type,
//     })

//     // ✅ Return everything your frontend needs
//     return NextResponse.json({
//       url: publicURL,
//       path: filename,
//       size: file.size,
//       type: file.type,
//     })
//   } catch (error) {
//     console.error("❌ Upload error:", error)
//     return NextResponse.json({ error: "File upload failed" }, { status: 400 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Accept file from any field name
    const file =
      (formData.get("photo") as File) ||
      (formData.get("resume") as File) ||
      (formData.get("file") as File)

    if (!file) {
      console.error("❌ No file found in formData. Keys:", Array.from(formData.keys()))
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Get optional folder + clean filename
    const folder = (formData.get("folder") as string) || ""
    const cleanFileName = (formData.get("cleanFileName") as string) || file.name

    // Final storage path
    const filename = folder ? `${folder}/${cleanFileName}` : cleanFileName

    const supabase = await createServerClient()

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (error) {
      console.error("❌ Supabase upload error:", error)
      return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 })
    }

    // Generate public URL
    const { data: publicUrlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filename)

    const publicURL = publicUrlData?.publicUrl

    console.log("✅ File uploaded:", { filename, publicURL })

    return NextResponse.json({
      url: publicURL,
      path: filename,
      type: file.type,
      size: file.size,
    })
  } catch (err) {
    console.error("❌ Upload error:", err)
    return NextResponse.json({ error: "File upload failed" }, { status: 400 })
  }
}
