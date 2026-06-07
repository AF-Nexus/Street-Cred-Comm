# Streetcred

Streetcred is an online streetwear shopping website for a Malawian streetwear brand. Customers browse and order clothes via WhatsApp; admins manage the catalog through a protected dashboard.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/streetcred run dev` — run the storefront (port 23361)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes to Turso
- Required env: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `SESSION_SECRET`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui, wouter routing
- API: Express 5
- DB: Turso (libsql) + Drizzle ORM
- Auth: JWT via jsonwebtoken + bcryptjs
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/src/schema/` — DB tables (products, announcements, admin)
- `lib/api-client-react/src/generated/` — generated React Query hooks
- `lib/api-zod/src/generated/` — generated Zod schemas for server validation
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/api-server/src/middlewares/auth.ts` — JWT auth middleware
- `artifacts/api-server/uploads/` — uploaded product images (served at /api/uploads/:filename)
- `artifacts/streetcred/src/` — React frontend

## Architecture decisions

- Turso (libsql) as the database — SQLite-compatible, runs on Render without complications
- `@libsql/client` is externalized from esbuild bundle (uses native binaries) — see build.mjs
- JWT tokens stored in localStorage under key `streetcred_admin_token`; sent as Bearer header
- Admin account seeded automatically on first server start (efkidgamer@gmail.com / admin1234)
- WhatsApp ordering: product page generates a pre-filled wa.me link to +265993702468
- Image uploads saved to `artifacts/api-server/uploads/`, served as static files via `/api/uploads/:filename`

## Product

- **Storefront**: Homepage with featured drops, announcement banner, /shop with category filters and search, /product/:id with WhatsApp order CTA
- **Admin Dashboard** (protected): Add/edit/delete products, upload real images, toggle availability, post/delete announcements, change password
- **Ordering**: Clicking "Order on WhatsApp" opens WhatsApp with the product name, price and selected size pre-filled

## User preferences

- WhatsApp number for orders: +265993702468
- Admin credentials: efkidgamer@gmail.com / admin1234
- Footer credit: "Website designed by Frankkaumbadev" → https://frankkaumba.gamer.gd
- Database: Turso (not Replit PostgreSQL)

## Gotchas

- Always run `pnpm run typecheck:libs` before `pnpm --filter @workspace/api-server run typecheck` after changing any lib/* package
- @libsql/client must stay in build.mjs `external` array — esbuild cannot bundle native binaries
- After OpenAPI spec changes, run codegen before using updated hooks
- SQLite/Turso uses integer for booleans (1/0) — `available` and `featured` fields are integers, not booleans

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
