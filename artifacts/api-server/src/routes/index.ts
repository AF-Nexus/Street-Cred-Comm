import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import announcementsRouter from "./announcements";
import adminRouter from "./admin";
import uploadsRouter from "./uploads";
import usersRouter from "./users";
import podcastEmbedsRouter from "./podcast-embeds";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(announcementsRouter);
router.use(adminRouter);
router.use(uploadsRouter);
router.use(usersRouter);
router.use(podcastEmbedsRouter);

export default router;
