import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import Image from "next/image"

export default function HomePage() {
  return (
    <main>
      <SiteHeader />
      <section className="border-b bg-gradient-to-br from-primary/10 via-background to-secondary/5">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Welcome to Royals Webtech
            </div>
            <h1 className="text-pretty text-4xl font-bold leading-tight md:text-5xl text-foreground">
              Interview & Registration Portal
            </h1>
            <p className="text-lg text-muted-foreground">
              Register for Internship or Job roles, or send an Inquiry. You'll receive a unique ID with a QR code for
              secure check-in at our premises.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/register/internship">Internship</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/register/job">Job</Link>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <Link href="/register/inquiry">Inquiry</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <Image
              src="/images/rwtlogo.png"
              alt="Royals Webtech"
              width={300}
              height={56}
              className="animate-in fade-in zoom-in-95 duration-700"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Choose Your Path</h2>
          <p className="mt-2 text-muted-foreground">Select the registration type that best fits your needs</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="mb-2 inline-block rounded-lg bg-primary/10 p-2">
                <span className="text-2xl">🎓</span>
              </div>
              <CardTitle className="text-balance">Internship Registration</CardTitle>
              <CardDescription>Apply for our internship program and gain valuable experience.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href="/register/internship">Start Registration</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="mb-2 inline-block rounded-lg bg-secondary/10 p-2">
                <span className="text-2xl">💼</span>
              </div>
              <CardTitle className="text-balance">Job Registration</CardTitle>
              <CardDescription>Submit your profile for open positions in our company.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href="/register/job">Start Registration</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="mb-2 inline-block rounded-lg bg-accent/10 p-2">
                <span className="text-2xl">💬</span>
              </div>
              <CardTitle className="text-balance">General Inquiry</CardTitle>
              <CardDescription>Contact us for other requests or information.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link href="/register/inquiry">Send Inquiry</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Royals Webtech Pvt. Ltd. All rights reserved. |
            <Link href="/auth/login" className="ml-1 text-primary hover:underline">
              Admin Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
