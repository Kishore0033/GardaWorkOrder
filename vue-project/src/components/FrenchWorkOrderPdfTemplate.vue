<template>
    <div class="work-order-template-container">
        <header>
            <div class="company-details-container">
                <div class="company-logo-container">
                    <img src="https://new-commercial-work-order-856953012.development.catalystserverless.com/server/work_order_function/api/logo/fr"
                        alt="Garda World Logo" width="250px" class="company-logo">
                </div>
                <div class="form-title-container">
                    <span class="title-tag">FICHE DE TRAVAIL COMMERCIAL</span>
                    <span class="form-contents">Tel: 1-833-427-3233 | Fax: 1-877-988-7236</span>
                    <span class="form-contents">www.garda.com/protection</span>
                </div>
                <div class="company-address-container">
                    <span class="sub-title-tag">Siège social</span>
                    <span class="form-contents">2300 Rue Émile Bélanger</span>
                    <span class="form-contents">Montreal QC H4R 3J4</span>
                </div>
            </div>
            <div class="company-branch-container">
                <div class="company-branch">
                    <span class="branch-title">Québec</span><br>
                    <span>300, 5500 Boul Des Galeries #1415</span><br>
                    <span>Québec QC G2K 2E26G5</span><br>
                </div>
                <div class="company-branch">
                    <span class="branch-title">Montréal</span><br>
                    <span>100, 9820 Du Prado Street</span><br>
                    <span>Saint-Léonard QC H1P 3B4</span><br>
                </div>
                <div class="company-branch">
                    <span class="branch-title"> Mississauga</span><br>
                    <span>2100A S Sheridan Way</span><br>
                    <span>Mississauga ON L5J 2M4</span><br>
                </div>
                <div class="company-branch">
                    <span class="branch-title">Edmonton</span><br>
                    <span>5640 104 Street NW</span><br>
                    <span>Edmonton AB T6H 2K2</span><br>
                </div>
                <div class="company-branch">
                    <span class="branch-title">Vancouver</span><br>
                    <span>1200 W 73 Ave</span><br>
                    <span>Vancouver BC V6P</span><br>
                </div>
            </div>
        </header>

        <div class="body-container">
            <table border="1" class="customer-details-table">
                <thead>
                    <tr>
                        <th style="display: flex; justify-content: space-between; border: none;">
                            <span class="table-header-title" style="margin-left: 0px;">No de dossier: {{ AccountNumber
                                }}</span>
                            <span class="table-header-title">No de Service: {{ ServiceName }}</span>
                            <span class="table-header-title">No de Système: {{ MonitoringId }}</span>
                            <span class="table-header-title">Bon de travail: {{ WorkOrderId }}</span>
                            <span class="table-header-title" style="border: none;">Date: {{ Date }}</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td
                            style="display: flex; justify-content: space-between; border-bottom: 0px solid black; border-left: none; border-right: none;">
                            <span class="company-name-details"><strong>Nom de la compagnie: </strong>{{ CompanyName
                                }}</span>
                            <span class="company-name-details"><strong>Tel: </strong>{{ CompanyPhone }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Contact sur place: </strong>{{ SiteContactName }}</td>
                    </tr>
                    <tr>
                        <td style="display: flex; justify-content: space-between; border: none;">
                            <span class="customer-address-details"><strong>Adresse: </strong>{{ Address }}</span>
                            <span class="customer-address-details"><strong>Ville: </strong>{{ City }}</span>
                            <span class="customer-address-details"><strong>Province: </strong>{{ Province }}</span>
                            <span class="customer-address-details"><strong>Code postal: </strong>{{ PostalCode }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table border="1" id="device-information-table-container">
                <thead>
                    <tr class="main-title-header">
                        <th colspan="8">INFORMATION SUR LES DISPOSITIFS</th>
                    </tr>
                    <tr>
                        <th style="width: 5%;">Dispositifs</th>
                        <th>Manufacturier</th>
                        <th>Description</th>
                        <th>Série/Adresse MAC</th>
                        <th>Adresse IP</th>
                        <th>Emplacement</th>
                        <th>Nom d’usager</th>
                        <th>Mot de passe </th>
                    </tr>
                </thead>
                <tbody id="inner-table-device-info-container">
                    <tr>
                        <td colspan="4">DDNS Usager/Mot de passe:</td>
                        <td colspan="4">VMS Usager/Mot de passe:</td>
                    </tr>
                    <tr>
                        <td colspan="2">Arrivée client:</td>
                        <td colspan="2">Départ client:</td>
                    </tr>
                    <tr>
                        <th colspan="4" class="main-title-header">REMARQUES</th>
                        <th colspan="4" class="main-title-header">LISTE DES DÉFICIENCES</th>
                    </tr>
                    <tr>
                        <td colspan="4"></td>
                        <td colspan="4"></td>
                    </tr>
                    <tr class="black-bg-title">
                        <th colspan="6">INFORMATIONS POUR LES CLIENTS ET LES TECHNICIENS</th>
                        <th>INITIALE DU CLIENT</th>
                        <th>INITIALE DU TECH</th>
                    </tr>
                    <tr>
                        <td colspan="6">Le client a reçu une formation et se sent à l'aise dans l'utilisation du système
                        </td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="6">Les techniciens ont nettoyé les lieux après avoir effectué le travail requis</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="6">L'étendue des travaux a été complétée et les déficiences répertoriées sont reconnues
                            (le cas échéant)</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="6">Affiche et/ou autocollants reçus par le client</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="6">Vérification de l'activation de tous les enregistrements et de toutes les
                            programmations</td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <div class="acknowledge-container"
                style="width: 100%; display: flex; align-items: center; justify-content: center; margin-top: 2px;">
                <span style="font-size: 10px; font-style: italic; font-weight: bold; text-align: center;">Je reconnais
                    que les matériaux et la main-d'œuvre indiqués sur cette feuille reflètent fidèlement l'exécution des
                    travaux et que ceux-ci ont été réalisés à ma satisfaction.</span>
            </div>
            <div class="tech-and-customer-sign-container">
                <div class="tech-name-and-sign-container">
                    <h4>Technicien</h4>
                    <div class="single-tech-customer-sign">
                        <div class="tech-customer-sign">
                            <strong class="by-text">Par</strong>
                        </div>
                        <span class="sign-label">Nom en lettres moulées du Revendeur/technicien</span>
                    </div>
                    <div class="single-tech-customer-sign">
                        <div class="tech-customer-sign">
                            <CustomSignatureField />
                        </div>
                        <span class="sign-label">Signature du revendeur/technicien</span>
                    </div>
                </div>
                <div class="client-name-and-sign-container">
                    <h4>Client</h4>
                    <div class="single-tech-customer-sign">
                        <div class="tech-customer-sign">
                            <strong class="by-text">Par</strong>
                        </div>
                        <span class="sign-label">Nom du Client</span>
                    </div>
                    <div class="single-tech-customer-sign">
                        <div class="tech-customer-sign">
                            <!-- <strong style="font-size: 12px;">By</strong> -->
                            <CustomSignatureField />
                            <!-- <img width="150px"
                                src="data:image/png;base64, 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" /> -->
                        </div>
                        <span class="sign-label">Signature du client</span>
                    </div>
                </div>
            </div>
            <div class="tech-and-customer-sign-container">
            </div>

            <!-- <div>
            <strong>Customer Signature: </strong>
            <img src="data:image/png;base64, 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" />
        </div> -->
        </div>
    </div>
</template>

<script>
import CustomSignatureField from './CustomSignatureField.vue';

export default {
    name: 'FrenchWorkOrderPdfTemplate',
    components: {
        CustomSignatureField
    },
    mounted() {
        this.$emit('loader', false)
    }
}
</script>

<style scoped>
* {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.work-order-template-container {
    background-color: white;
    padding: 20px;
    min-height: 63.4vh;
    overflow: auto;
}

.company-details-container {
    display: flex;
    justify-content: space-between;
    /* align-items: center; */
}

header {
    color: rgb(65, 65, 65);
}

.form-title-container h1,
.company-address-container h1,
.company-address-container h2,
.form-title-container p,
.company-address-container p,
.form-title-container span,
.company-address-container span {
    text-align: center;
}

.form-title-container,
.company-address-container {
    display: flex;
    flex-direction: column;
}

.form-title-container {
    margin-left: -50px;
    font-weight: bold;
}

.company-address-container {
    margin-right: 20px;
}

.company-branch-container {
    padding: 20px;
    display: flex;
    justify-content: space-between;
}

.company-branch {
    font-size: 12px;
}

.title-tag {
    font-size: 25px;
    font-weight: bold;
}

.sub-title-tag {
    font-size: 22px;
    font-weight: bold;
}

/* .company-branch {
    display: flex;
} */

.branch-title {
    font-size: 16px;
    font-weight: bold;
}

.company-address-container {
    font-size: 14px;
}

.customer-details-table,
#device-information-table-container {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid black;
    font-size: 10px;
}

#device-information-table-container {
    margin-top: 22px;
}

.customer-details-table th,
.main-title-header {
    padding: 0px 6px;
    background-color: #D8D9DA;
}

#device-information-table-container th {
    width: 13%;
}

.customer-details-table td,
#device-information-table-container th,
#device-information-table-container td {
    padding: 3px 6px;
    height: 12px;
}

.table-header-title {
    width: 20%;
    text-align: left;
    border-right: 1px solid black;
    margin-left: 10px;
    padding: 2px;
}

.company-name-details {
    width: 38%;
}

.customer-address-details {
    width: 25%;
}

.black-bg-title {
    color: white;
    background-color: rgb(18, 18, 18);
}

.tech-and-customer-sign-container {
    margin-top: 20px;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
}

.tech-name-and-sign-container,
.client-name-and-sign-container {
    border: 1px solid rgb(196, 196, 196);
    width: 45%;
    padding: 15px 20px;
    border-radius: 5px;
}

.single-tech-customer-sign {
    /* width: 20%; */
}

.tech-customer-sign {
    padding: 5px 10px;
    border-bottom: 1px solid black;
    display: flex;
    align-items: center;
    margin-top: 20px;
}

.sign-label {
    font-size: 8px;
    font-style: italic;
    font-weight: bold;
}

.acknowledge-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2px;
    font-size: 12px;
    font-style: italic;
    font-weight: bold;
    text-align: center;
}

@media only screen and (max-width: 576px) {
    html {
        font-size: 6px !important; /* Adjust percentage or pixel size as needed */
    }

    * {
        font-size: inherit !important;
    }
    .company-address-container h1,
    .company-address-container h2,
    .form-title-container p,
    .company-address-container p,
    .company-address-container span {
        font-size: 6px !important;
    }
    .form-contents {
        font-size: 8px !important;
    }
    .form-title-container {
        margin-left: -10px;
    }
    .company-branch {
        font-size: 6px !important;
    }
    .title-tag {
        font-size: 12px !important;
        font-weight: bold;
    }
    .sub-title-tag {
        font-size: 10px !important;
    }
    .customer-details-table, #device-information-table-container {
        font-size: 4px !important;
    }
    .sign-label {
        font-size: 4px !important;
    }
    .customer-details-table td, #device-information-table-container th, #device-information-table-container td {
        height: 4px;
    }
    .acknowledge-container {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 2px;
        font-size: 5px !important;
        font-style: italic;
        font-weight: bold;
        text-align: center;
    }
    .tech-and-customer-sign-container {
        display: flex;
        flex-direction: column;
    }
    .tech-name-and-sign-container,
    .client-name-and-sign-container {
        margin-left: -15px;
        width: 97%;
    }
    .tech-name-and-sign-container {
        margin-bottom: 20px;
    }
    .tech-name-and-sign-container h4,
    .client-name-and-sign-container h4 {
        font-size: 10px !important;
    }
    .by-text {
        font-size: 8px !important;
    }
    .company-logo-container {
        width: 25%;
    }
    .company-logo {
        width: 100%;
    }
}
</style>