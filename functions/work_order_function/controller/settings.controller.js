import { getSetting, updateSetting } from '../model/settings.model.js';
import catalyst from 'zcatalyst-sdk-node';

export const getSettingController = async (req, res) => {
    try {
        const app = catalyst.initialize(req);
        const getSettingValue = await getSetting(app, req.params.setting);
        res.status(200).send(getSettingValue.SettingValue);
    } catch(e) {
        console.log("Error Getting Settings: ", e);
        res.status(400).send("Error getting settings");
    }
}

export const updateLangController = async (req, res) => {
    try {
        const app = catalyst.initialize(req);
        const { language } = req.body;
        const updateLangValue = await updateSetting(app, 'lang', language);
        res.status(200).send(updateLangValue);
    } catch (error) {
        console.log("Error updating language: ", e);
        res.status(400).send("Error updating language");
    }
}