import { Router } from "express";
import { getSettingController, updateLangController } from "../controller/settings.controller.js";

const router = Router();

router.all('/', (req, res) => {
    res.send("Setting API is Ready")
})

router.get('/:setting', getSettingController);
router.post('/lang', updateLangController);

export default router;