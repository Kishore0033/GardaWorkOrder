import { Router } from "express";
import { getAllTechniciansController, getRecordsController, searchRecordsController, addNewInstalledEquipmentController, testController } from "../controller/crm.controller.js";

const router = Router();

router.get('/', (req, res) => {
    res.send("Running")
})
router.get('/deals/:id', searchRecordsController);
router.get('/technicians', getAllTechniciansController);
router.post('/installedEquipments', addNewInstalledEquipmentController);
router.post('/test', testController)

export default router;