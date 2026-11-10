# Clinic booking page

**Live:** https://booking.koya.checkmeout.me

React page for booking clinic appointments: see open times, book one, and get a confirmation. Patients can also look up their bookings by email, page through them, and cancel. Built for Task 1 of the Koya Academy assessment on top of [koya-booking-api](https://github.com/skeby/koya-booking-api).

Stack: React 19, Vite, TypeScript, antd 6, Tailwind v4, TanStack Query, React Hook Form with zod, Redux Toolkit (theme preference), dayjs.

## Keeping the API key out of the browser

The browser only calls `/api/*` on this site. A server-side proxy adds the `X-API-Key` header and forwards the request to the API, so the key never appears in the bundle or in the browser's network tab.

- On Vercel: [`api/proxy.ts`](api/proxy.ts), reached through a rewrite in `vercel.json`. It forwards only the five routes the page uses; `/reset` and anything else get a 404.
- In development: the Vite dev server proxy in `vite.config.ts` does the same.

`API_URL` and `API_KEY` have no `VITE_` prefix, so Vite never inlines them into client code.

## Running locally

```bash
pnpm install
cp .env.example .env   # API_URL and API_KEY of a running koya-booking-api
pnpm dev
```

## Notes

- Each booking attempt sends an `Idempotency-Key`. A double click or a retry of the same details reuses the key, so it can't book twice; changing the details starts a new attempt.
- The slot grid refreshes every 30 seconds, and after a failed booking, so times other patients take grey out.
- Times show in the visitor's time zone, which the page states.
