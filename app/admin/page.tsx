import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { isAdmin, getAdminRole } from "@/lib/admin"
import { AdminRowActions } from "@/components/admin-row-actions"
import { Button } from "@/components/ui/button"

export default async function AdminPage() {
  const supabase = await createServerClient()
  const admin = await isAdmin(supabase)
  if (!admin) {
    redirect("/auth/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const adminRole = await getAdminRole(supabase)

  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200)

  const { data: stats } = await supabase.from("registrations").select("type, status, checked_in")

  const totalRegistrations = stats?.length || 0
  const checkedInCount = stats?.filter((s) => s.checked_in).length || 0
  const byType =
    stats?.reduce((acc: any, s: any) => {
      acc[s.type] = (acc[s.type] || 0) + 1
      return acc
    }, {}) || {}

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Role:{" "}
              <Badge variant="outline" className="ml-2">
                {adminRole || "admin"}
              </Badge>
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <Button asChild variant="outline" className="w-full md:w-auto bg-transparent">
              <Link href="/admin/scan">QR Scanner</Link>
            </Button>
            <Button asChild className="w-full md:w-auto">
              <Link href="/admin/manage-admins">Manage Admins</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-6">
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold">{totalRegistrations}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Total Registrations</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold">{checkedInCount}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Checked In</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold">{byType.internship || 0}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Internships</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 md:pt-6">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold">{byType.job || 0}</p>
                <p className="text-xs md:text-sm text-muted-foreground">Job Apps</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-destructive">{error.message}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="p-2">UID</th>
                      <th className="p-2">Name</th>
                      <th className="p-2 hidden md:table-cell">Type</th>
                      <th className="p-2 hidden lg:table-cell">Email</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data || []).map((r) => (
                      <tr key={r.uid} className="border-t hover:bg-muted/50">
                        <td className="p-2 font-mono text-xs">{r.uid}</td>
                        <td className="p-2 text-sm">{r.name}</td>
                        <td className="p-2 capitalize hidden md:table-cell text-xs">{r.type}</td>
                        <td className="p-2 text-xs hidden lg:table-cell truncate">{r.email}</td>
                        <td className="p-2">
                          <Badge variant={r.checked_in ? "default" : "secondary"} className="text-xs">
                            {r.checked_in ? "Checked-in" : r.status || "new"}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <AdminRowActions
                            uid={r.uid}
                            checkedIn={!!r.checked_in}
                            status={r.status || "new"}
                            candidateName={r.name}
                            candidateEmail={r.email}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {!error && (!data || data.length === 0) ? <p className="text-muted-foreground">No records yet.</p> : null}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
