"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Admin = {
  id: string
  email: string
  role: string
  created_at: string
}

const roleColors: Record<string, string> = {
  director: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  hr: "bg-green-100 text-green-800",
  developer: "bg-orange-100 text-orange-800",
  executive: "bg-pink-100 text-pink-800",
}

export function ManageAdminsClient({ initialAdmins }: { initialAdmins: Admin[] }) {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins)
  const [newEmail, setNewEmail] = useState("")
  const [newRole, setNewRole] = useState("admin")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  async function addAdmin() {
    if (!newEmail.trim()) {
      alert("Please enter an email")
      return
    }

    try {
      setLoading(true)
      const res = await fetch("/api/admin/add-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, role: newRole }),
      })

      if (!res.ok) throw new Error(await res.text())

      const data = await res.json()
      setAdmins([...admins, data])
      setNewEmail("")
      setNewRole("admin")
      setOpen(false)
      alert("Admin added successfully")
    } catch (e: any) {
      alert(`Failed to add admin: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function updateRole(id: string, newRole: string) {
    try {
      const res = await fetch("/api/admin/update-admin-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: newRole }),
      })

      if (!res.ok) throw new Error(await res.text())

      setAdmins(admins.map((a) => (a.id === id ? { ...a, role: newRole } : a)))
    } catch (e: any) {
      alert(`Failed to update role: ${e.message}`)
    }
  }

  async function deleteAdmin(id: string) {
    if (!confirm("Are you sure you want to delete this admin?")) return

    try {
      const res = await fetch("/api/admin/delete-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) throw new Error(await res.text())

      setAdmins(admins.filter((a) => a.id !== id))
    } catch (e: any) {
      alert(`Failed to delete admin: ${e.message}`)
    }
  }

  return (
    <div className="space-y-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Add New Admin</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Admin User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="director">Director</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addAdmin} disabled={loading} className="w-full">
              {loading ? "Adding..." : "Add Admin"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Created</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-t hover:bg-muted/50">
                <td className="p-2">{admin.email}</td>
                <td className="p-2">
                  <Select value={admin.role} onValueChange={(v) => updateRole(admin.id, v)}>
                    <SelectTrigger className="h-8 w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="developer">Developer</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="p-2 text-xs">{new Date(admin.created_at).toLocaleDateString()}</td>
                <td className="p-2">
                  <Button size="sm" variant="destructive" onClick={() => deleteAdmin(admin.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
