const TABLE_NAME = "SETTINGS";
const allSettings = {
    'lang': '22372000000056479'
};

export const getSetting = async (app, setting) => {
    try {
        const table = app.datastore().table(TABLE_NAME);
        const getData = await table.getRow(allSettings[setting]);
        return getData
    } catch(e) {
        throw new Error('Error getting settings: ' + e);
    }
}

export const updateSetting = async (app, setting, value) => {
    try {
        const table = app.datastore().table(TABLE_NAME);
        const updatedRowData = {
            ROWID: allSettings[setting],
            SettingValue: value
        };

        const updatedData = await table.updateRow(updatedRowData);
        return updatedData
    } catch(e) {
        throw new Error("Error updating settings: " + e);
    }
}