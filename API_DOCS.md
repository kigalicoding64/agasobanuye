# API Documentation

All routes are under `/api`. Authenticated routes read a JWT from the
`iwacu_session` httpOnly cookie set at login/register.

## Auth

### POST /api/auth/register
Body: `{ name, email?, phone?, password }` (email or phone required)
Response: `{ id, name }` + sets session cookie

### POST /api/auth/login
Body: `{ email?, phone?, password }`
Response: `{ id, name, role }` + sets session cookie

## Movies

### GET /api/movies?category=&q=
Public. Returns published movies, optionally filtered.

### GET /api/movies/:id
Public. Single movie.

### PATCH /api/movies/:id
Admin/Creator only (enforced via middleware on `/api/admin/*` - move this
route under that path or add an explicit role check if you expose it directly).
Body: any subset of Movie fields to update.

### DELETE /api/movies/:id
Admin only.

## Admin

### POST /api/admin/movies
Requires ADMIN or CREATOR role.
Body: `{ title, description, genre, category, isVip, isPpv, priceRwf?, videoUrl?, posterUrl? }`
Response: created Movie record.

### GET /api/admin/upload-url?filename=&contentType=&kind=video|poster
Requires ADMIN or CREATOR role.
Response: `{ uploadUrl, publicUrl }` - PUT the raw file to `uploadUrl`, then
save `publicUrl` on the movie via POST /api/admin/movies.

## Payments

### POST /api/payments/initiate
Requires login.
Body: `{ plan?: "VIP_MONTHLY"|"VIP_YEARLY", movieId?: string, method: "MOMO"|"AIRTEL"|"CARD"|"PAYPAL", phone? }`
- Provide `plan` for a subscription purchase, or `movieId` for a pay-per-view unlock.
- For MOMO/AIRTEL: triggers a USSD/PIN prompt on the given phone; response is `{ status, message }`.
- For CARD: response is `{ checkoutUrl }` - redirect the browser there.

### POST /api/payments/webhook
Called by Flutterwave, not by your frontend. Verifies the `verif-hash` header,
then marks the matching Payment as SUCCESS/FAILED and activates subscriptions
automatically.

### GET /api/subscriptions/status
Requires login. Response: `{ active, plan, expiresAt }`.

## Access control

The single source of truth for "can this user watch this movie" lives in
`src/lib/access.ts` (`canAccessMovie`). It is called server-side in
`watch/[slug]/page.tsx` before the player ever renders, so the rule can't be
bypassed by guessing video URLs.
