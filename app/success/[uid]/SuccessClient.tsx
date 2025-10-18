
// "use client"

// import { useEffect, useState } from "react"
// import Image from "next/image"
// import dynamic from "next/dynamic"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"

// // ✅ Client-only import for QRCode
// const QRCode = dynamic(() => import("react-qr-code"), { ssr: false })

// interface Registration {
//   uid: string
//   name: string
//   email: string
//   phone: string
//   purpose: string
//   type: string
//   photo_url: string | null
//   resume_url: string | null
// }

// export default function SuccessClient({ uid }: { uid: string }) {
//   const [registration, setRegistration] = useState<Registration | null>(null)
//   const [error, setError] = useState<string | null>(null)
//   const router = useRouter()

//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await fetch(`/api/registrations?uid=${uid}`)
//         if (!res.ok) throw new Error("Failed to load registration")
//         const result = await res.json()

//         const record = result.data?.[0] || result.data || null
//         setRegistration(record)
//       } catch (err: any) {
//         console.error(err)
//         setError("Failed to load registration")
//       }
//     }
//     load()
//   }, [uid])

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-red-500">{error}</p>
//       </div>
//     )
//   }

//   if (!registration) {
//     return (
//       <div className="text-center py-12 text-muted-foreground">
//         Loading registration details...
//       </div>
//     )
//   }

//   const photoSrc =
//     registration.photo_url && registration.photo_url.startsWith("http")
//       ? registration.photo_url
//       : "/no-photo.png"

//   return (
//     <div className="text-center space-y-6">
//       <h1 className="text-3xl font-bold">Registration Complete</h1>
//       <p className="text-gray-600">Your unique ID</p>
//       <h2 className="text-xl font-mono tracking-wide">{registration.uid}</h2>

//       <div className="border rounded-xl p-6 mt-6 shadow-md max-w-md mx-auto bg-white">
//         {/* ✅ Company Logo on Top */}
//         <div className="flex justify-center mb-4">
//           <Image
//             src="/rwtlogo.png" // ✅ make sure this exists in /public folder
//             alt="Royals Webtech Pvt. Ltd. Logo"
//             width={160}
//             height={60}
//             className="object-contain"
//             priority
//           />
//         </div>

//         <div className="flex justify-between items-start border-b pb-3 mb-3">
//           <div className="text-left">
//             <h3 className="font-semibold text-blue-800">Royals Webtech Pvt. Ltd.</h3>
//             <p className="text-sm text-gray-600">Registration</p>
//             <p className="text-xs text-gray-500 mt-1">ID: {registration.uid}</p>
//           </div>

//           <Image
//             src={photoSrc}
//             alt="Applicant photo"
//             width={90}
//             height={90}
//             className="border rounded-md object-cover bg-gray-100"
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-3 text-left mb-4">
//           <div>
//             <p className="text-sm text-gray-500">Name</p>
//             <p className="font-medium">{registration.name || "-"}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Phone</p>
//             <p className="font-medium">{registration.phone || "-"}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Email</p>
//             <p className="font-medium break-all">{registration.email || "-"}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Purpose</p>
//             <p className="font-medium capitalize">{registration.purpose || "-"}</p>
//           </div>
//         </div>

//         <div className="mt-4">
//           <p className="text-sm text-gray-500 mb-2">Scan for verification</p>
//           <div className="flex justify-center">
//             <QRCode
//               value={`${process.env.NEXT_PUBLIC_SITE_URL}/verify/${registration.uid}`}
//               size={130}
//             />
//           </div>
//         </div>
//       </div>

//       <p className="text-xs text-gray-500">
//         Note: This QR can only be validated inside the admin panel of this site.
//       </p>

//       <div className="flex justify-center gap-3 mt-6">
//         <Button onClick={() => router.push("/")}>Back to Home</Button>
//         <Button
//           variant="secondary"
//           onClick={() => router.push("/register/internship")}
//         >
//           Register Another
//         </Button>
//         <Button variant="outline" onClick={() => window.print()}>
//           Print ID Card
//         </Button>
//       </div>
//     </div>
//   )
// }

// "use client"

// import { useEffect, useState } from "react"
// import Image from "next/image"
// import dynamic from "next/dynamic"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"

// // ✅ Dynamically import QRCode for client-side rendering only
// const QRCode = dynamic(() => import("react-qr-code"), { ssr: false })

// interface Registration {
//   uid: string
//   name: string
//   email: string
//   phone: string
//   purpose: string
//   type: string
//   photo_url: string | null
//   resume_url: string | null
// }

// export default function SuccessClient({ uid }: { uid: string }) {
//   const [registration, setRegistration] = useState<Registration | null>(null)
//   const [error, setError] = useState<string | null>(null)
//   const router = useRouter()

//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await fetch(`/api/registrations?uid=${uid}`)
//         if (!res.ok) throw new Error("Failed to load registration")
//         const result = await res.json()
//         const record = result.data?.[0] || result.data || null
//         setRegistration(record)
//       } catch (err: any) {
//         console.error(err)
//         setError("Failed to load registration")
//       }
//     }
//     load()
//   }, [uid])

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-red-500">{error}</p>
//       </div>
//     )
//   }

//   if (!registration) {
//     return (
//       <div className="text-center py-12 text-muted-foreground">
//         Loading registration details...
//       </div>
//     )
//   }

//   const photoSrc =
//     registration.photo_url && registration.photo_url.startsWith("http")
//       ? registration.photo_url
//       : "/no-photo.png"

//   const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify/${registration.uid}`
//   const logoUrl = "/rwtlogo.png"

//   return (
//     <div className="text-center space-y-6">
//       <h1 className="text-3xl font-bold text-blue-900">Registration Complete</h1>
//       <p className="text-gray-600">Your registration ID:</p>
//       <h2 className="text-xl font-mono tracking-wide">{registration.uid}</h2>

//       {/* === ID Card === */}
//       <div className="border rounded-2xl p-6 mt-6 shadow-lg max-w-sm mx-auto bg-white relative overflow-hidden">
//         {/* Logo Header */}
//         <div className="flex flex-col items-center border-b pb-4 mb-4">
//           <Image
//             src={logoUrl}
//             alt="Royals Webtech Logo"
//             width={130}
//             height={40}
//             className="object-contain mb-2"
//           />
//           <h3 className="font-semibold text-blue-800 text-lg">
//             Royals Webtech Pvt. Ltd.
//           </h3>
//           <p className="text-xs text-gray-600 tracking-wide">Official Registration ID Card</p>
//         </div>

//         {/* User Info */}
//         <div className="flex justify-between items-start border-b pb-3 mb-3">
//           <div className="text-left">
//             <p className="text-sm text-gray-500">ID</p>
//             <p className="font-medium text-gray-800">{registration.uid}</p>
//             <p className="text-sm text-gray-500 mt-2">Name</p>
//             <p className="font-medium text-gray-800">{registration.name}</p>
//             <p className="text-sm text-gray-500 mt-2">Phone</p>
//             <p className="font-medium text-gray-800">{registration.phone}</p>
//             <p className="text-sm text-gray-500 mt-2">Email</p>
//             <p className="font-medium text-gray-800 break-all">{registration.email}</p>
//           </div>

//           <Image
//             src={photoSrc}
//             alt="Applicant photo"
//             width={85}
//             height={85}
//             className="border rounded-md object-cover bg-gray-100 shadow-sm"
//           />
//         </div>

//         {/* QR Code */}
//         <div className="text-center mt-4">
//           <p className="text-sm text-gray-500 mb-2">Scan to verify</p>
//           <div className="flex justify-center">
//             <QRCode value={`${process.env.NEXT_PUBLIC_SITE_URL}/success/${registration.uid}`} size={110} />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-5 text-center border-t pt-3">
//           <p className="text-xs text-gray-500">
//             Issued by Royals Webtech Pvt. Ltd. | For verification only
//           </p>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-center gap-3 mt-6">
//         <Button onClick={() => router.push("/")}>Back to Home</Button>
//         <Button variant="secondary" onClick={() => router.push("/register/internship")}>
//           Register Another
//         </Button>
//         <Button variant="outline" onClick={() => window.print()}>
//           Print ID Card
//         </Button>
//       </div>
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

// ✅ Dynamically import QRCode for client rendering
const QRCode = dynamic(() => import("react-qr-code"), { ssr: false })

interface Registration {
  uid: string
  name: string
  email: string
  phone: string
  purpose: string
  type: string
  photo_url: string | null
  resume_url: string | null
}

export default function SuccessClient({ uid }: { uid: string }) {
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // ✅ Load registration data
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/registrations?uid=${uid}`)
        if (!res.ok) throw new Error("Failed to load registration")
        const result = await res.json()
        const record = result.data?.[0] || result.data || null
        setRegistration(record)
      } catch (err) {
        console.error(err)
        setError("Failed to load registration")
      }
    }
    load()
  }, [uid])

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 font-medium">
        {error}
      </div>
    )
  }

  if (!registration) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading registration details...
      </div>
    )
  }

  const photoSrc =
    registration.photo_url && registration.photo_url.startsWith("http")
      ? registration.photo_url
      : "/no-photo.png"

  return (
    <div className="text-center space-y-6 pb-12">
      <h1 className="text-3xl font-bold text-blue-800">
        Registration Successful 🎉
      </h1>
      <p className="text-gray-600">Here’s your official registration ID card:</p>

      {/* ✅ ID CARD */}
      <div className="border rounded-2xl shadow-md bg-white p-6 mx-auto max-w-md">
        {/* Logo Section */}
        <div className="flex justify-center mb-4">
          <Image
            src="/images/rwtlogo.png"
            alt="Royals Webtech Pvt. Ltd. Logo"
            width={180}
            height={60}
            priority
            className="object-contain"
          />
        </div>

        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-2 mb-3">
          <h2 className="text-lg font-semibold text-blue-900">Royals Webtech Pvt. Ltd.</h2>
          <p className="text-sm text-gray-500">Official Registration ID Card</p>
        </div>

        {/* User Info */}
        <div className="flex justify-between items-start border-b pb-3 mb-3">
          <div className="text-left space-y-1">
            <p className="text-sm text-gray-500">ID</p>
            <p className="font-semibold text-blue-700">{registration.uid}</p>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{registration.name}</p>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-sm break-all">{registration.email}</p>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-sm">{registration.phone}</p>
            <p className="text-sm text-gray-500">Purpose</p>
            <p className="capitalize text-sm">{registration.purpose}</p>
          </div>
          <div className="flex flex-col items-center">
            <Image
              src={photoSrc}
              alt="Applicant Photo"
              width={90}
              height={90}
              className="rounded-lg border object-cover bg-gray-100"
            />
          </div>
        </div>

        {/* QR Code */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-1">Scan for verification</p>
          <div className="flex justify-center">
            <QRCode
              value={`${process.env.NEXT_PUBLIC_SITE_URL}/verify/${registration.uid}`}
              size={120}
            />
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        This ID is automatically generated. Verification is possible via QR scan in admin panel.
      </p>

      <div className="flex justify-center gap-3 mt-6">
        <Button onClick={() => router.push("/")}>Back to Home</Button>
        <Button variant="secondary" onClick={() => router.push("/register/internship")}>
          Register Another
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          Print ID Card
        </Button>
      </div>
    </div>
  )
}
