import { Router, type IRouter } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAdmin } from "../middlewares/auth";
import { logger } from "../lib/logger";

const workspaceRoot = process.cwd().endsWith(path.join("artifacts", "api-server"))
  ? path.resolve(process.cwd(), "../..")
  : process.cwd();

const uploadsDir = path.resolve(workspaceRoot, "artifacts/api-server/uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const router: IRouter = Router();

router.post("/uploads/image", requireAdmin, upload.single("image"), (req, res): void => {
  if (!req.file) {
    res.status(400).json({ error: "No image file provided" });
    return;
  }

  const url = `/api/uploads/${req.file.filename}`;
  logger.info({ filename: req.file.filename }, "Image uploaded");
  res.json({ url });
});

router.get("/uploads/:filename", (req, res): void => {
  const filename = Array.isArray(req.params.filename)
    ? req.params.filename[0]
    : req.params.filename;
  const filepath = path.join(uploadsDir, filename);
  if (!fs.existsSync(filepath)) {
    res.status(404).json({ error: "File not found" });
    return;
  }
  res.sendFile(filepath);
});

export default router;
