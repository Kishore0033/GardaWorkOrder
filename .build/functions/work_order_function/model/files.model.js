export const getLogo = async (app, lang) => {
	const logoId = {
        en: '22372000000056507',
        fr: '22372000000056513'
    };
	const currentLogo = lang === 'fr' ? logoId[lang] : logoId['en'];
    try {
        const filestore = app.filestore();
        const folder = filestore.folder('22372000000056488');
        const downloadPromise = await folder.getFileStream(currentLogo);
        return downloadPromise;
        // downloadPromise.then(async (fileObject) => {
        //     // await imageCompressor(fileObject, res);
        //     fileObject.pipe(res);
        // })
    } catch(err) {
        throw new Error("Error getting logo: " + err);
    }
}