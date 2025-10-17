"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AdminRowActions({
  uid,
  checkedIn,
  status,
  candidateName,
  candidateEmail,
}: {
  uid: string
  checkedIn: boolean
  status: "new" | "reviewing" | "shortlisted" | "rejected" | "hired" | "checked_in" | string
  candidateName?: string
  candidateEmail?: string
}) {
  const [busy, setBusy] = useState(false)
  const [curStatus, setCurStatus] = useState(status)
  const [curChecked, setCurChecked] = useState(checkedIn)
  const [emailOpen, setEmailOpen] = useState(false)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailMessage, setEmailMessage] = useState("")
  const [emailBusy, setEmailBusy] = useState(false)

  async function update(partial: any) {
    try {
      setBusy(true)
      const res = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, ...partial }),
      })
      if (!res.ok) throw new Error(await res.text())
      if (typeof partial.checked_in === "boolean") setCurChecked(partial.checked_in)
      if (typeof partial.status === "string") setCurStatus(partial.status)
    } catch (e) {
      console.error("[v0] update row failed", e)
      alert("Failed to update row")
    } finally {
      setBusy(false)
    }
  }

  async function sendEmail() {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      alert("Please fill in subject and message")
      return
    }

    try {
      setEmailBusy(true)
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, subject: emailSubject, message: emailMessage }),
      })
      if (!res.ok) throw new Error(await res.text())
      alert("Email sent successfully")
      setEmailOpen(false)
      setEmailSubject("")
      setEmailMessage("")
    } catch (e) {
      console.error("[v0] send email failed", e)
      alert("Failed to send email")
    } finally {
      setEmailBusy(false)
    }
  }

  return (
    <div className="flex items-center gap-1 md:gap-2 flex-wrap">
      <Button
        size="sm"
        variant={curChecked ? "secondary" : "default"}
        disabled={busy}
        onClick={() => update({ checked_in: !curChecked, status: !curChecked ? "checked_in" : curStatus })}
        className="text-xs md:text-sm"
      >
        {curChecked ? "Undo" : "Check-in"}
      </Button>

      <Select value={curStatus} onValueChange={(v) => update({ status: v })} disabled={busy}>
        <SelectTrigger className="h-8 w-[100px] md:w-[140px] text-xs">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="reviewing">Reviewing</SelectItem>
          <SelectItem value="shortlisted">Shortlisted</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
          <SelectItem value="hired">Hired</SelectItem>
          <SelectItem value="checked_in">Checked-in</SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="text-xs md:text-sm bg-transparent">
            Email
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Email to {candidateName || "Candidate"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Email message"
                rows={6}
              />
            </div>
            <Button onClick={sendEmail} disabled={emailBusy} className="w-full">
              {emailBusy ? "Sending..." : "Send Email"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
