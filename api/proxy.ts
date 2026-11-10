/**
 * Server-side proxy between the booking page and the booking API.
 *
 * The browser calls /api/<path> on this site (vercel.json rewrites that to
 * /api/proxy?__path=<path>). This function adds the API key from a
 * server-only env var and forwards the request, so the key never reaches the
 * browser. Only the routes the page uses are forwarded: /reset and anything
 * else gets a 404.
 */

const ROUTES: { method: string; pattern: RegExp }[] = [
  { method: "GET", pattern: /^slots$/ },
  { method: "GET", pattern: /^bookings$/ },
  { method: "POST", pattern: /^bookings$/ },
  { method: "GET", pattern: /^bookings\/[^/]+$/ },
  { method: "DELETE", pattern: /^bookings\/[^/]+$/ },
]

const json = (status: number, body: unknown) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } })

async function forward(request: Request): Promise<Response> {
  const apiUrl = process.env.API_URL
  const apiKey = process.env.API_KEY
  if (!apiUrl || !apiKey) {
    return json(500, { error: "The booking service is not configured" })
  }

  const url = new URL(request.url)
  const path = (url.searchParams.get("__path") ?? "").replace(/^\/+|\/+$/g, "")
  url.searchParams.delete("__path")

  const segments = path.split("/")
  const allowed =
    !segments.some((segment) => segment === "." || segment === "..") &&
    ROUTES.some(
      (route) => route.method === request.method && route.pattern.test(path)
    )
  if (!allowed) return json(404, { error: "not found" })

  const headers = new Headers({ "X-API-Key": apiKey, Accept: "application/json" })
  for (const name of ["content-type", "idempotency-key"]) {
    const value = request.headers.get(name)
    if (value) headers.set(name, value)
  }

  const upstream = await fetch(`${apiUrl.replace(/\/+$/, "")}/${path}${url.search}`, {
    method: request.method,
    headers,
    body: request.method === "POST" ? await request.text() : undefined,
  })

  const responseHeaders = new Headers({
    "Content-Type": upstream.headers.get("content-type") ?? "application/json",
    "Cache-Control": "no-store",
  })
  const retryAfter = upstream.headers.get("retry-after")
  if (retryAfter) responseHeaders.set("Retry-After", retryAfter)

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: responseHeaders,
  })
}

export const GET = forward
export const POST = forward
export const DELETE = forward
