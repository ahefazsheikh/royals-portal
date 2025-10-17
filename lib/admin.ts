import type { SupabaseClient } from "@supabase/supabase-js"

export type AdminRole = "director" | "admin" | "hr" | "developer" | "executive"

export async function isAdmin(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) return false

  const { data, error } = await supabase
    .from("admins")
    .select("email, role")
    .eq("email", user.email)
    .eq("active", true)
    .maybeSingle()

  return !!data && !error
}

export async function getAdminRole(supabase: SupabaseClient): Promise<AdminRole | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) return null

  const { data, error } = await supabase
    .from("admins")
    .select("role")
    .eq("email", user.email)
    .eq("active", true)
    .maybeSingle()

  return !error && data ? (data.role as AdminRole) : null
}

export async function requireAdmin(supabase: SupabaseClient) {
  const ok = await isAdmin(supabase)
  if (!ok) {
    throw new Error("Forbidden")
  }
}

export async function requireRole(supabase: SupabaseClient, requiredRole: AdminRole) {
  const role = await getAdminRole(supabase)
  if (!role) throw new Error("Forbidden")

  const roleHierarchy: Record<AdminRole, number> = {
    director: 5,
    admin: 4,
    executive: 3,
    hr: 2,
    developer: 1,
  }

  if ((roleHierarchy[role] || 0) < (roleHierarchy[requiredRole] || 0)) {
    throw new Error("Insufficient permissions")
  }
}
