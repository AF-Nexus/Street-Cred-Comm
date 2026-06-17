import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import router from "./routes";
import { logger } from "./lib/logger";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const app: Express = express();
const frontendDist = path.join(process.cwd(), "artifacts/streetcred/dist");

// Run safe startup migrations
async function runMigrations() {
  try {
    await db.run(sql`ALTER TABLE users ADD COLUMN country TEXT DEFAULT 'MW'`);
  } catch { /* column likely already exists */ }
  try {
    await db.run(sql`ALTER TABLE users ADD COLUMN reset_code TEXT`);
  } catch { /* column likely already exists */ }
  try {
    await db.run(sql`ALTER TABLE users ADD COLUMN reset_code_expiry TEXT`);
  } catch { /* column likely already exists */ }
  try {
    await db.run(sql`CREATE TABLE IF NOT EXISTS podcast_embeds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      embed_url TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`);
  } catch { /* table likely already exists */ }
  logger.info("DB migrations checked");
}

runMigrations().catch((e) => logger.warn({ err: e }, "Migration warning"));

app.use(pinoHttp({
  logger,
  serializers: {
    req(req) {
      return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
    },
    res(res) {
      return { statusCode: res.statusCode };
    },
  },
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Serve frontend
app.use(express.static(frontendDist));
app.get("/{*path}", (_req, res) => {
  res.sendFile(path.join(frontendDist, "index.html"));
});

export default app;
