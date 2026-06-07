import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import announcementsRouter from "./announcements";
import adminRouter from "./admin";
import uploadsRouter from "./uploads";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(announcementsRouter);
router.use(adminRouter);
router.use(uploadsRouter);

export default router;
