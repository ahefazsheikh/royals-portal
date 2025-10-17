import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { requireRole } from "@/lib/admin"
import { ManageAdminsClient } from "@/components/manage-admins-client"

export default async function ManageAdminsPage() {
  const supabase = await createServerClient()

  try {
    await requireRole(supabase, "director")
  } catch {
    redirect("/admin")
  }

  const { data: admins } = await supabase.from("admin_emails").select("*").order("created_at", { ascending: false })

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        <h1 className="text-3xl font-bold">Manage Admin Users</h1>
        <p className="text-muted-foreground mt-2">Only Directors can manage admin roles and permissions</p>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Admin Users & Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <ManageAdminsClient initialAdmins={admins || []} />
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Director</h3>
                <p className="text-sm text-muted-foreground">Full access - Manage admins, view all data, send emails</p>
              </div>
              <div>
                <h3 className="font-semibold">Admin</h3>
                <p className="text-sm text-muted-foreground">
                  Full access - Manage registrations, send emails, view analytics
                </p>
              </div>
              <div>
                <h3 className="font-semibold">HR</h3>
                <p className="text-sm text-muted-foreground">
                  HR access - View registrations, send emails, manage status
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Developer</h3>
                <p className="text-sm text-muted-foreground">Limited access - View registrations, check-in only</p>
              </div>
              <div>
                <h3 className="font-semibold">Executive</h3>
                <p className="text-sm text-muted-foreground">View-only access - View registrations and analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
