import { Router } from "express";
import { getLogoController } from "../controller/files.controller.js";

const router = Router();

router.get('/', (req, res) => {
    res.send('Logo')
})
router.get('/:lang', getLogoController);

export default router;