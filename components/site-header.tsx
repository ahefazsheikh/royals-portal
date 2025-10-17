// "use client"

// import Image from "next/image"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"

// export function SiteHeader() {
//   return (
//     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
//         <Link href="/" className="flex items-center gap-3" aria-label="Royals Webtech Pvt Ltd">
//           <Image src="/images/rwtlogo.png" alt="Royals Webtech Pvt. Ltd. logo" width={180} height={32} priority />
//           <span className="sr-only">Royals Webtech Pvt. Ltd.</span>
//         </Link>
//         <nav className="flex items-center gap-2">
//           <Button asChild variant="ghost" className="hidden sm:inline-flex">
//             <Link href="/register/internship">Internship</Link>
//           </Button>
//           <Button asChild variant="ghost" className="hidden sm:inline-flex">
//             <Link href="/register/job">Job</Link>
//           </Button>
//           <Button asChild variant="ghost" className="hidden sm:inline-flex">
//             <Link href="/register/inquiry">Inquiry</Link>
//           </Button>
//           <Button asChild variant="outline" size="sm">
//             <Link href="/auth/login">Admin</Link>
//           </Button>
//         </nav>
//       </div>
//     </header>
//   )
// }
"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Royals Webtech Pvt. Ltd."
        >
          <Image
            src="/images/rwtlogo.png"        // ✅ Make sure this file is in /public/images/
            alt="Royals Webtech Pvt. Ltd. logo"
            width={180}
            height={40}
            priority
            unoptimized                       // ✅ Prevent Next.js from optimizing missing local images
          />
          <span className="sr-only">Royals Webtech Pvt. Ltd.</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/register/internship">Internship</Link>
          </Button>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/register/job">Job</Link>
          </Button>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/register/inquiry">Inquiry</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/auth/login">Admin</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
