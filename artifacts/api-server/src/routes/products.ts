import { Router, type IRouter } from "express";
import { eq, and, sql } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  CreateProductBody,
  GetProductParams,
  UpdateProductParams,
  UpdateProductBody,
  DeleteProductParams,
  ToggleProductAvailabilityParams,
  ToggleProductAvailabilityBody,
} from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/products/featured", async (_req, res): Promise<void> => {
  const products = await db
    .select()
    .from(productsTable)
    .where(and(eq(productsTable.featured, 1), eq(productsTable.available, 1)))
    .limit(8);
  res.json(products);
});

router.get("/products/stats", requireAdmin, async (_req, res): Promise<void> => {
  const all = await db.select().from(productsTable);
  const total = all.length;
  const available = all.filter((p) => p.available === 1).length;
  const unavailable = all.filter((p) => p.available === 0).length;
  const categoryMap: Record<string, number> = {};
  for (const p of all) {
    const cat = p.category ?? "Uncategorized";
    categoryMap[cat] = (categoryMap[cat] ?? 0) + 1;
  }
  const categories = Object.entries(categoryMap).map(([category, count]) => ({
    category,
    count,
  }));
  res.json({ total, available, unavailable, categories });
});

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, available } = parsed.data;
  let query = db.select().from(productsTable).$dynamic();

  const conditions = [];
  if (category) {
    conditions.push(eq(productsTable.category, category));
  }
  if (available !== undefined) {
    conditions.push(eq(productsTable.available, parseInt(available, 10)));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const products = await query.orderBy(sql`${productsTable.createdAt} desc`);
  res.json(products);
});

router.post("/products", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const now = new Date().toISOString();
  const [product] = await db
    .insert(productsTable)
    .values({ ...parsed.data, createdAt: now })
    .returning();

  res.status(201).json(product);
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetProductParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, params.data.id));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(product);
});

router.patch("/products/:id/availability", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = ToggleProductAvailabilityParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = ToggleProductAvailabilityBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [product] = await db
    .update(productsTable)
    .set({ available: body.data.available })
    .where(eq(productsTable.id, params.data.id))
    .returning();

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(product);
});

router.patch("/products/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateProductParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateProductBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [product] = await db
    .update(productsTable)
    .set(body.data)
    .where(eq(productsTable.id, params.data.id))
    .returning();

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(product);
});

router.delete("/products/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteProductParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db
    .delete(productsTable)
    .where(eq(productsTable.id, params.data.id))
    .returning();

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
