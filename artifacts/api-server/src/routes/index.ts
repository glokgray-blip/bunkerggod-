import { Router, type IRouter } from "express";
import healthRouter from "./health";
import charactersRouter from "./characters";
import messagesRouter from "./messages";
import browserRouter from "./browser";

const router: IRouter = Router();

router.use(healthRouter);
router.use(charactersRouter);
router.use(messagesRouter);
router.use(browserRouter);

export default router;
