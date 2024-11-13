import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Antd from 'ant-design-vue';
import { createI18n } from 'vue-i18n';


const initApp = async () => {
    const app = createApp(App);
    app.use(router)

    await router.isReady();

    const currentRoute = router.currentRoute.value;
    // if(currentRoute.href === "/app/") {
    //     router.push('/en');
    //     setTimeout(() => {
    //         window.location.reload();
    //     }, 200)
    //     return;
    // }
    // console.log(currentRoute);
    const lang = currentRoute.params.lang || 'en';

    const messages = {
        en: {
            changeLanguage: 'Language',
            workOrderFormTitle: 'COMMERCIAL WORK ORDER FORM',
            previous: 'PREVIOUS',
            next: 'NEXT',
            submitWorkOrder: 'SUBMIT WORK ORDER',
            warnings: {
                noSystemFound: 'No System Found',
                noSystemFoundWithId: 'No systems found with this ID. Please provide a valid ID.',
                noSystemFoundMsg: 'Please provide either a System ID or a Service Call ID as a parameter.'
            },
            steps: {
                jobInformation: 'JOB INFORMATION',
                workOrder: 'WORK ORDER',
                signatures: 'SIGNATURES'
            },
            jobInfoForm: {
                workOrderDate: 'Appointment Date/Time',
                startWorkTime: 'Start Work Time',
                companyName: 'Company Name',
                companyAddress: 'Company Address',
                siteContactName: 'Contact Name',
                siteContactAddress: 'Site Address',
                technicianName: 'Technician Name',
                setStatus: 'Set Status',
                addTechnician: 'Add Technician',
                addNewTechnician: 'Add New Technician',
                technicianDetails: 'Technician Details'
            },
            workOrderForm: {
                typeOfWork: 'Type Of Work',
                selectTypeOfWork: 'Select type of work',
                quotesItems: 'Quotes items',
                soldItems: 'Work Order',
                installedEquipments: 'Installed/Serviced Items',
                addItem: 'Add Equipment',
                updateItem: 'Update Item',
                cancel: 'Cancel',
                systemType: 'System Type',
                selectSystemType: 'Select system type',
                productName: 'Product Name',
                zone: 'Zone',
                serviced: 'Serviced',
                deviceType: 'Device Type',
                alarmType: 'Alarm Type',
                status: 'Status',
                location: 'Location',
                part: 'Part ',
                newExisting: 'New/Existing',
                wiredWireless: 'Wired/Wireless',
                username: 'Username',
                password: 'Password',
                forwardedPorts: 'Forwarded Ports',
                serialMacAddress: 'Serial / MAC Address',
                ipAddress: 'IP Address',
                relatedDoorHardwareId: 'Related Door Hardware ID',
                doorHardwareType: 'Door Hardware Type',
                relatedReaderId: 'Related Reader ID',
                ddns: 'DDNS',
                showAll: 'Show All',
                showLess: 'Show Less',
                install: 'Install',
                previous: 'Previous',
                next: "Next",
                edit: 'Edit'
            }
        },
        fr: {
            changeLanguage: 'langue',
            workOrderFormTitle: 'FICHE DE TRAVAIL COMMERCIAL',
            previous: 'PRÉCÉDENT',
            next: 'SUIVANT',
            submitWorkOrder: 'SOUMETTRE UN ORDRE DE TRAVAIL',
            warnings: {
                noSystemFound: 'Aucun système trouvé',
                noSystemFoundWithId: 'Aucun système trouvé avec cet ID. Veuillez fournir une pièce d\'identité valide.',
                noSystemFoundMsg: 'Veuillez fournir un ID système ou un ID d\'appel de service comme paramètre.'
            },
            steps: {
                jobInformation: 'INFORMATIONS SUR LE TRAVAIL',
                workOrder: 'BON DE TRAVAIL',
                signatures: 'SIGNATURES'
            },
            jobInfoForm: {
                workOrderDate: 'Date/heure du rendez-vous',
                startWorkTime: 'Début du temps de travail',
                companyName: 'Nom de la compagnie',
                companyAddress: 'Adresse de l\'entreprise',
                siteContactName: 'Nom du contact',
                siteContactAddress: 'Adresse du site',
                technicianName: 'Nom du technicien',
                setStatus: 'Définir le statut',
                addTechnician: 'Ajouter un technicien',
                addNewTechnician: 'Ajouter un nouveau technicien',
                technicianDetails: 'Détails du technicien'
            },
            workOrderForm: {
                typeOfWork: 'Type de travail',
                selectTypeOfWork: 'Sélectionnez le type de travail',
                quotesItems: 'Articles de devis',
                soldItems: 'Bon de travail',
                installedEquipments: 'Articles installés/réparés',
                addItem: 'Ajouter de l\'équipement',
                updateItem: 'Mettre à jour l\'élément',
                cancel: 'Annuler',
                systemType: 'Type de système',
                selectSystemType: 'Sélectionnez le type de système',
                productName: 'Nom du produit',
                zone: 'Zone',
                serviced: 'Entretenu',
                deviceType: 'Type d\'appareil',
                alarmType: 'Type d\'alarme',
                status: 'Statut',
                location: 'Emplacement',
                part: 'Partie',
                newExisting: 'Nouveau/Existant',
                wiredWireless: 'Filaire/Sans fil',
                username: 'Nom d\'utilisateur',
                password: 'Mot de passe',
                forwardedPorts: 'Ports transférés',
                serialMacAddress: 'Série/Adresse MAC',
                ipAddress: 'Adresse IP',
                relatedDoorHardwareId: 'ID de quincaillerie de porte associé',
                doorHardwareType: 'Type de quincaillerie de porte',
                relatedReaderId: 'ID de lecteur associé',
                ddns: 'DDNS',
                showAll: 'Afficher tout',
                showLess: 'Afficher moins',
                install: 'Installer',
                previous: 'Précédent',
                next: 'Suivant',
                edit: 'Modifier'
            }
        }
    };

    const i18n = createI18n({
        legacy: false,
        locale: lang,
        fallbackLocale: 'en',
        messages
    });

    app.use(i18n)
        .use(Antd)
        .mount('#app');
};

initApp();