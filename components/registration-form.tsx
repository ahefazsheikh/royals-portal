// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { z } from "zod"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { cn } from "@/lib/utils"

// const schema = z.object({
//   name: z.string().min(2, "Name is required."),
//   email: z.string().email("Invalid email format."),
//   phone: z.string().min(8, "Phone number is required."),
//   college: z.string().min(2).optional().or(z.literal("")),
//   degree: z.string().optional().or(z.literal("")),
//   graduationYear: z.string().optional().or(z.literal("")),
//   experienceYears: z.string().optional().or(z.literal("")),
//   purpose: z.string().min(2),
//   referredBy: z.string().optional().or(z.literal("")),
//   portfolioUrl: z.string().url().optional().or(z.literal("")),
//   githubUrl: z.string().url().optional().or(z.literal("")),
//   skills: z.string().optional().or(z.literal("")),
//   notes: z.string().optional().or(z.literal("")),
// })

// type FormValues = z.infer<typeof schema>

// export function RegistrationForm({ type }: { type: "internship" | "job" | "inquiry" }) {
//   const router = useRouter()
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [file, setFile] = useState<File | null>(null)
//   const [photoFile, setPhotoFile] = useState<File | null>(null)
//   const [error, setError] = useState<string | null>(null)
//   const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

//   const form = useForm<FormValues>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       purpose: type,
//     },
//   })

//   async function onSubmit(values: FormValues) {
//     setError(null)
//     setValidationErrors({})
//     setIsSubmitting(true)

//     const newErrors: Record<string, string> = {}

//     if (photoFile && photoFile.size > 5 * 1024 * 1024) {
//       newErrors.photo = "Photo must be less than 5MB"
//     }
//     if (file && file.size > 10 * 1024 * 1024) {
//       newErrors.resume = "Resume must be less than 10MB"
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setValidationErrors(newErrors)
//       setIsSubmitting(false)
//       return
//     }

//     const formData = new FormData()

//     for (const key in values) {
//       const value = values[key as keyof FormValues]
//       if (value !== null && value !== undefined && value !== "") {
//         formData.append(key, value)
//       }
//     }

//     if (photoFile) {
//       formData.append("photo", photoFile)
//     }
//     if (file) {
//       formData.append("resume", file)
//     }

//     formData.append("type", type)
//     formData.append("purpose", type)

//     try {
//       const res = await fetch("/api/registrations", {
//         method: "POST",
//         body: formData,
//       })

//       if (!res.ok) {
//         const errText = await res.text()
//         setError(errText || "Submission failed. Please check your inputs.")
//         return
//       }

//       const data = await res.json()
//       router.push(`/success/${data.uid}`)
//     } catch (e: any) {
//       setError("An unexpected error occurred during submission.")
//       console.error(e)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-pretty capitalize text-2xl md:text-3xl">{type} Registration</CardTitle>
//         <CardDescription>Fill your details below. Fields marked with * are required.</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
//           <div className="grid gap-2">
//             <Label htmlFor="name">Name *</Label>
//             <Input id="name" {...form.register("name")} required />
//             {form.formState.errors.name && (
//               <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
//             )}
//           </div>
//           <div className="grid gap-2 md:grid-cols-2">
//             <div className="grid gap-2">
//               <Label htmlFor="email">Email *</Label>
//               <Input id="email" type="email" {...form.register("email")} required />
//               {form.formState.errors.email && (
//                 <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
//               )}
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="phone">Phone *</Label>
//               <Input id="phone" type="tel" {...form.register("phone")} required />
//               {form.formState.errors.phone && (
//                 <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
//               )}
//             </div>
//           </div>
//           <div className="grid gap-2 md:grid-cols-2">
//             <div className="grid gap-2">
//               <Label htmlFor="college">College</Label>
//               <Input id="college" {...form.register("college")} />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="degree">Degree</Label>
//               <Input id="degree" {...form.register("degree")} placeholder="B.Tech, M.Sc, etc." />
//             </div>
//           </div>
//           <div className="grid gap-2 md:grid-cols-3">
//             <div className="grid gap-2">
//               <Label htmlFor="graduationYear">Graduation Year</Label>
//               <Input id="graduationYear" {...form.register("graduationYear")} placeholder="2025" />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="experienceYears">Experience (years)</Label>
//               <Input id="experienceYears" {...form.register("experienceYears")} placeholder="0" />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="purpose">Purpose *</Label>
//               <Select defaultValue={type} onValueChange={(v) => form.setValue("purpose", v)}>
//                 <SelectTrigger id="purpose">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="internship">Internship</SelectItem>
//                   <SelectItem value="job">Job</SelectItem>
//                   <SelectItem value="inquiry">Inquiry</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="grid gap-2 md:grid-cols-2">
//             <div className="grid gap-2">
//               <Label htmlFor="referredBy">Referred By</Label>
//               <Input id="referredBy" {...form.register("referredBy")} />
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="skills">Key Skills</Label>
//               <Input id="skills" {...form.register("skills")} placeholder="React, Node, SQL" />
//             </div>
//           </div>

//           <div className="grid gap-2 md:grid-cols-2">
//             <div className="grid gap-2">
//               <Label htmlFor="portfolioUrl">Portfolio URL</Label>
//               <Input id="portfolioUrl" {...form.register("portfolioUrl")} placeholder="https://..." />
//               {form.formState.errors.portfolioUrl && (
//                 <p className="text-sm text-destructive">{form.formState.errors.portfolioUrl.message}</p>
//               )}
//             </div>
//             <div className="grid gap-2">
//               <Label htmlFor="githubUrl">GitHub URL</Label>
//               <Input id="githubUrl" {...form.register("githubUrl")} placeholder="https://github.com/..." />
//               {form.formState.errors.githubUrl && (
//                 <p className="text-sm text-destructive">{form.formState.errors.githubUrl.message}</p>
//               )}
//             </div>
//           </div>

//           <div className="grid gap-2">
//             <Label htmlFor="notes">Notes</Label>
//             <Textarea id="notes" {...form.register("notes")} rows={4} placeholder="Additional info" />
//           </div>

//           <div className="grid gap-2">
//             <Label htmlFor="resume">Resume (PDF)</Label>
//             <Input id="resume" type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
//             <p className="text-xs text-muted-foreground">Submit a single PDF file (max 10MB).</p>
//             {validationErrors.resume && <p className="text-sm text-destructive">{validationErrors.resume}</p>}
//           </div>

//           <div className="grid gap-2">
//             <Label htmlFor="photo">Photo (JPG/PNG)</Label>
//             <Input
//               id="photo"
//               type="file"
//               accept="image/jpeg,image/png"
//               onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
//             />
//             <p className="text-xs text-muted-foreground">Use a clear headshot. PNG or JPG (max 5MB).</p>
//             {validationErrors.photo && <p className="text-sm text-destructive">{validationErrors.photo}</p>}
//           </div>

//           {error ? <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</p> : null}

//           <div className={cn("flex flex-col md:flex-row items-center gap-3 pt-2")}>
//             <Button type="submit" disabled={form.formState.isSubmitting || isSubmitting} className="w-full md:w-auto">
//               {form.formState.isSubmitting || isSubmitting ? "Submitting..." : "Submit"}
//             </Button>
//             <p className="text-xs text-muted-foreground">
//               A confirmation email with your unique ID will be sent to your email address.
//             </p>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }

// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { z } from "zod"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { cn } from "@/lib/utils"

// const schema = z.object({
//   name: z.string().min(2, "Name is required."),
//   email: z.string().email("Invalid email format."),
//   phone: z.string().min(8, "Phone number is required."),
//   college: z.string().optional().or(z.literal("")),
//   degree: z.string().optional().or(z.literal("")),
//   graduationYear: z.string().optional().or(z.literal("")),
//   experienceYears: z.string().optional().or(z.literal("")),
//   purpose: z.string().min(2),
//   referredBy: z.string().optional().or(z.literal("")),
//   portfolioUrl: z.string().url().optional().or(z.literal("")),
//   githubUrl: z.string().url().optional().or(z.literal("")),
//   skills: z.string().optional().or(z.literal("")),
//   notes: z.string().optional().or(z.literal("")),
// })

// type FormValues = z.infer<typeof schema>

// export function RegistrationForm({ type }: { type: "internship" | "job" | "inquiry" }) {
//   const router = useRouter()
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [file, setFile] = useState<File | null>(null)
//   const [photoFile, setPhotoFile] = useState<File | null>(null)
//   const [error, setError] = useState<string | null>(null)
//   const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

//   const form = useForm<FormValues>({
//     resolver: zodResolver(schema),
//     defaultValues: { purpose: type },
//   })

//   // ✅ Upload helper (for photo or resume)
//   const uploadFileToSupabase = async (file: File, folder: string) => {
//     const formData = new FormData()
//     formData.append(file.type.includes("image") ? "photo" : "resume", file)
//     formData.append("folder", folder)

//     const res = await fetch("/api/upload", {
//       method: "POST",
//       body: formData,
//     })

//     if (!res.ok) {
//       const err = await res.json().catch(() => ({}))
//       throw new Error(err.error || "File upload failed")
//     }

//     const data = await res.json()
//     return data.url as string
//   }

//   async function onSubmit(values: FormValues) {
//     setError(null)
//     setValidationErrors({})
//     setIsSubmitting(true)

//     const newErrors: Record<string, string> = {}

//     if (photoFile && photoFile.size > 5 * 1024 * 1024) {
//       newErrors.photo = "Photo must be less than 5MB"
//     }
//     if (file && file.size > 10 * 1024 * 1024) {
//       newErrors.resume = "Resume must be less than 10MB"
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setValidationErrors(newErrors)
//       setIsSubmitting(false)
//       return
//     }

//     try {
//       // ✅ Create unique registration UID
//       const uid = `RWT-${type.toUpperCase()}-${new Date()
//         .toLocaleDateString("en-GB")
//         .replace(/\//g, "")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

//       // ✅ Upload files first
//       let photo_url = null
//       let resume_url = null

//       if (photoFile) {
//         photo_url = await uploadFileToSupabase(photoFile, `submissions/${uid}`)
//       }

//       if (file) {
//         resume_url = await uploadFileToSupabase(file, `submissions/${uid}`)
//       }

//       // ✅ Combine form data + file URLs
//       const payload = {
//         ...values,
//         uid,
//         type,
//         purpose: type,
//         photo_url,
//         resume_url,
//       }

//       // ✅ Send everything to backend
//       const res = await fetch("/api/registrations", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       })

//       if (!res.ok) {
//         const errText = await res.text()
//         throw new Error(errText || "Submission failed. Please check your inputs.")
//       }

//       const data = await res.json()
//       router.push(`/success/${data.uid}`)
//     } catch (e: any) {
//       console.error("❌ Submission error:", e)
//       setError(e.message || "An unexpected error occurred during submission.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-pretty capitalize text-2xl md:text-3xl">{type} Registration</CardTitle>
//         <CardDescription>Fill your details below. Fields marked with * are required.</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
//           {/* Name, Email, Phone */}
//           <div className="grid gap-2">
//             <Label htmlFor="name">Name *</Label>
//             <Input id="name" {...form.register("name")} required />
//             {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
//           </div>

//           <div className="grid gap-2 md:grid-cols-2">
//             <div>
//               <Label htmlFor="email">Email *</Label>
//               <Input id="email" type="email" {...form.register("email")} required />
//               {form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}
//             </div>
//             <div>
//               <Label htmlFor="phone">Phone *</Label>
//               <Input id="phone" type="tel" {...form.register("phone")} required />
//               {form.formState.errors.phone && <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>}
//             </div>
//           </div>

//           {/* Education Info */}
//           <div className="grid gap-2 md:grid-cols-2">
//             <div>
//               <Label htmlFor="college">College</Label>
//               <Input id="college" {...form.register("college")} />
//             </div>
//             <div>
//               <Label htmlFor="degree">Degree</Label>
//               <Input id="degree" {...form.register("degree")} placeholder="B.Tech, M.Sc, etc." />
//             </div>
//           </div>

//           <div className="grid gap-2 md:grid-cols-3">
//             <div>
//               <Label htmlFor="graduationYear">Graduation Year</Label>
//               <Input id="graduationYear" {...form.register("graduationYear")} placeholder="2025" />
//             </div>
//             <div>
//               <Label htmlFor="experienceYears">Experience (years)</Label>
//               <Input id="experienceYears" {...form.register("experienceYears")} placeholder="0" />
//             </div>
//             <div>
//               <Label htmlFor="purpose">Purpose *</Label>
//               <Select defaultValue={type} onValueChange={(v) => form.setValue("purpose", v)}>
//                 <SelectTrigger id="purpose">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="internship">Internship</SelectItem>
//                   <SelectItem value="job">Job</SelectItem>
//                   <SelectItem value="inquiry">Inquiry</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Links and Skills */}
//           <div className="grid gap-2 md:grid-cols-2">
//             <div>
//               <Label htmlFor="referredBy">Referred By</Label>
//               <Input id="referredBy" {...form.register("referredBy")} />
//             </div>
//             <div>
//               <Label htmlFor="skills">Key Skills</Label>
//               <Input id="skills" {...form.register("skills")} placeholder="React, Node, SQL" />
//             </div>
//           </div>

//           <div className="grid gap-2 md:grid-cols-2">
//             <div>
//               <Label htmlFor="portfolioUrl">Portfolio URL</Label>
//               <Input id="portfolioUrl" {...form.register("portfolioUrl")} placeholder="https://..." />
//             </div>
//             <div>
//               <Label htmlFor="githubUrl">GitHub URL</Label>
//               <Input id="githubUrl" {...form.register("githubUrl")} placeholder="https://github.com/..." />
//             </div>
//           </div>

//           {/* Notes */}
//           <div className="grid gap-2">
//             <Label htmlFor="notes">Notes</Label>
//             <Textarea id="notes" {...form.register("notes")} rows={4} placeholder="Additional info" />
//           </div>

//           {/* Resume Upload */}
//           <div className="grid gap-2">
//             <Label htmlFor="resume">Resume (PDF)</Label>
//             <Input id="resume" type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
//             <p className="text-xs text-muted-foreground">Submit a single PDF file (max 10MB).</p>
//             {validationErrors.resume && <p className="text-sm text-destructive">{validationErrors.resume}</p>}
//           </div>

//           {/* Photo Upload */}
//           <div className="grid gap-2">
//             <Label htmlFor="photo">Photo (JPG/PNG)</Label>
//             <Input id="photo" type="file" accept="image/jpeg,image/png" onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} />
//             <p className="text-xs text-muted-foreground">Use a clear headshot. PNG or JPG (max 5MB).</p>
//             {validationErrors.photo && <p className="text-sm text-destructive">{validationErrors.photo}</p>}
//           </div>

//           {/* Error + Submit */}
//           {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</p>}

//           <div className={cn("flex flex-col md:flex-row items-center gap-3 pt-2")}>
//             <Button type="submit" disabled={isSubmitting || form.formState.isSubmitting} className="w-full md:w-auto">
//               {isSubmitting || form.formState.isSubmitting ? "Submitting..." : "Submit"}
//             </Button>
//             <p className="text-xs text-muted-foreground">
//               A confirmation email with your unique ID will be sent to your email address.
//             </p>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const schema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email format."),
  phone: z.string().min(8, "Phone number is required."),
  college: z.string().optional().or(z.literal("")),
  degree: z.string().optional().or(z.literal("")),
  graduationYear: z.string().optional().or(z.literal("")),
  experienceYears: z.string().optional().or(z.literal("")),
  purpose: z.string().min(2),
  referredBy: z.string().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  skills: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
})

type FormValues = z.infer<typeof schema>

export function RegistrationForm({ type }: { type: "internship" | "job" | "inquiry" }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { purpose: type },
  })

  // ✅ MAIN SUBMIT FUNCTION
  async function onSubmit(values: FormValues) {
    try {
      setError(null)
      setValidationErrors({})
      setIsSubmitting(true)

      const newErrors: Record<string, string> = {}

      // File size checks
      if (photoFile && photoFile.size > 5 * 1024 * 1024)
        newErrors.photo = "Photo must be less than 5MB"
      if (file && file.size > 10 * 1024 * 1024)
        newErrors.resume = "Resume must be less than 10MB"

      if (Object.keys(newErrors).length > 0) {
        setValidationErrors(newErrors)
        setIsSubmitting(false)
        return
      }

      // ✅ Generate unique ID
      const uid = `RWT-${type.toUpperCase()}-${new Date()
        .toLocaleDateString("en-GB")
        .replace(/\//g, "")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

      // ✅ Create FormData for multipart/form-data
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value.toString())
        }
      })

      if (photoFile) formData.append("photo", photoFile)
      if (file) formData.append("resume", file)

      formData.append("uid", uid)
      formData.append("type", type)
      formData.append("purpose", type)

      // ✅ Important: Do NOT set headers here
      const res = await fetch("/api/registrations", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Submission failed")

      router.push(`/success/${data.uid}`)
    } catch (e: any) {
      console.error("❌ Submission error:", e)
      setError(e.message || "An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ✅ RENDER FORM
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-pretty capitalize text-2xl md:text-3xl">
          {type} Registration
        </CardTitle>
        <CardDescription>
          Fill your details below. Fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" {...form.register("name")} required />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* Email + Phone */}
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...form.register("email")} required />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" type="tel" {...form.register("phone")} required />
              {form.formState.errors.phone && (
                <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <Label htmlFor="college">College</Label>
              <Input id="college" {...form.register("college")} />
            </div>
            <div>
              <Label htmlFor="degree">Degree</Label>
              <Input id="degree" {...form.register("degree")} placeholder="B.Tech, M.Sc, etc." />
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-3">
            <div>
              <Label htmlFor="graduationYear">Graduation Year</Label>
              <Input id="graduationYear" {...form.register("graduationYear")} placeholder="2025" />
            </div>
            <div>
              <Label htmlFor="experienceYears">Experience (years)</Label>
              <Input id="experienceYears" {...form.register("experienceYears")} placeholder="0" />
            </div>
            <div>
              <Label htmlFor="purpose">Purpose *</Label>
              <Select defaultValue={type} onValueChange={(v) => form.setValue("purpose", v)}>
                <SelectTrigger id="purpose">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="job">Job</SelectItem>
                  <SelectItem value="inquiry">Inquiry</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Skills / Referral */}
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <Label htmlFor="referredBy">Referred By</Label>
              <Input id="referredBy" {...form.register("referredBy")} />
            </div>
            <div>
              <Label htmlFor="skills">Key Skills</Label>
              <Input id="skills" {...form.register("skills")} placeholder="React, Node, SQL" />
            </div>
          </div>

          {/* Links */}
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <Label htmlFor="portfolioUrl">Portfolio URL</Label>
              <Input id="portfolioUrl" {...form.register("portfolioUrl")} placeholder="https://..." />
            </div>
            <div>
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input id="githubUrl" {...form.register("githubUrl")} placeholder="https://github.com/..." />
            </div>
          </div>

          {/* Notes */}
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...form.register("notes")} rows={4} placeholder="Additional info" />
          </div>

          {/* Resume Upload */}
          <div className="grid gap-2">
            <Label htmlFor="resume">Resume (PDF)</Label>
            <Input id="resume" type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <p className="text-xs text-muted-foreground">Submit a single PDF file (max 10MB).</p>
            {validationErrors.resume && <p className="text-sm text-destructive">{validationErrors.resume}</p>}
          </div>

          {/* Photo Upload */}
          <div className="grid gap-2">
            <Label htmlFor="photo">Photo (JPG/PNG)</Label>
            <Input
              id="photo"
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-muted-foreground">Use a clear headshot. PNG or JPG (max 5MB).</p>
            {validationErrors.photo && <p className="text-sm text-destructive">{validationErrors.photo}</p>}
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</p>}

          {/* Submit */}
          <div className={cn("flex flex-col md:flex-row items-center gap-3 pt-2")}>
            <Button
              type="submit"
              disabled={isSubmitting || form.formState.isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting || form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
            <p className="text-xs text-muted-foreground">
              A confirmation email with your unique ID will be sent to your email address.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}



