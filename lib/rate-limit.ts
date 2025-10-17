const requests = new Map<string, number[]>()

export function rateLimit(key: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now()
  const windowStart = now - windowMs

  if (!requests.has(key)) {
    requests.set(key, [])
  }

  const times = requests.get(key)!
  const recentRequests = times.filter((t) => t > windowStart)

  if (recentRequests.length >= limit) {
    return false
  }

  recentRequests.push(now)
  requests.set(key, recentRequests)
  return true
}
