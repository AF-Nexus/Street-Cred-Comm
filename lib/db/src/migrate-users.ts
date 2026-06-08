import { createClient } from "@libsql/client";

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
  const cols = await client.execute("PRAGMA table_info(users)");
  const existing = cols.rows.map((r: any) => r[1] as string);
  console.log("Existing columns:", existing);
  const toAdd = [
    { name: "country", def: "TEXT DEFAULT 'MW'" },
    { name: "reset_code", def: "TEXT" },
    { name: "reset_code_expiry", def: "TEXT" },
  ];
  for (const col of toAdd) {
    if (!existing.includes(col.name)) {
      await client.execute(`ALTER TABLE users ADD COLUMN ${col.name} ${col.def}`);
      console.log("Added:", col.name);
    } else {
      console.log("Exists:", col.name);
    }
  }
  console.log("Migration done.");
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
