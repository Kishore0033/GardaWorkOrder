import { getLogo } from '../model/files.model.js';
import catalyst from 'zcatalyst-sdk-node';

export const getLogoController = async (req, res) => {
    const { lang } = req.params;
    const app = catalyst.initialize(req);

    try {
        const getLogoImg = getLogo(app, lang);
        getLogoImg.then(async (fileObject) => {
            fileObject.pipe(res);
        })
    } catch (error) {
        console.log(error);
        res.status(400).send("Error getting logo");
    }
}