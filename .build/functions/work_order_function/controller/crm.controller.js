import { searchRecords, getRecords, createNewInstallation, getAllTechnicians } from "../model/crm.model.js";

export const searchRecordsController = async (req, res) => {
    try {
        const { id } = req.params;
        const searchedRecord = await searchRecords(id);
        // console.log(searchedRecord);

        res.json(searchedRecord);
    } catch (error) {
        res.json({msg: "Failed to search data", error});
    }
}

export const getRecordsController = async (req, res) => {
    try {
        await getRecords();
        res.send("Success")
    } catch (error) {
        res.send("Error getting records");
    }
}

export const getAllTechniciansController = async (req, res) => {
    try {
        const getTechnicians = await getAllTechnicians();
        res.json(getTechnicians);
    } catch (error) {
        console.error("Error getting technician details in controller:", error);
        res.status(500).send("Error getting technician details");
    }
}

export const addNewInstalledEquipmentController = async (req, res) => {
    try {
        const equipmentDetails = req.body;
        const addNewInstalledEquipmentResp = await createNewInstallation(equipmentDetails);
        res.status(200).json({ message: "New installed equipment added successfully", addNewInstalledEquipmentResp});
    } catch (error) {
        console.error("Error adding new installed equipment: ", error);
        res.status(400).json({ message: "Error adding new installed equipment" })
    }
}

export const testController = async (req, res) => {
    try {
        const equipmentDetails = req.body;

        // const resp = await updateSoldItem(equipmentDetails);
        // res.json(resp);
    } catch (error) {
        res.send("Error getting related list");
    }
}