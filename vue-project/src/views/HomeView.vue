<template>
  <a-spin :spinning="loader">
    <div class="home">
      <FormHeader @stepUpdate="handleStepUpdate" @loader="(load) => loader = load" :currentStep="currentStep" />
      <div class="all-forms-container">
        <!-- <div style="height: 78vh; background-color: blue; overflow: auto;"> -->
        <JobInfoForm v-if="currentStep === 0" :getJobInfo="JobInfo" :technicianDetails="allTechnicians" @loader="(load) => loader = load" :nextComponent="isNext" />
        <FLHAForm v-if="currentStep === 1" :getJobInfo="JobInfo" @loader="(load) => loader = load" :nextComponent="isNext" />
        <WorkOrderForm v-if="currentStep === 2" :getWorkOrder="workOrderData" @loader="(load) => loader = load" />
        <WorkOrderPdfTemplate v-if="currentStep === 3 && lang === 'en'" @loader="(load) => loader = load" :getJobInfo="JobInfo" :workOrderData="workOrderData" />
        <FrenchWorkOrderPdfTemplate v-if="currentStep === 3 && lang === 'fr'" @loader="(load) => loader = load" />
        <div class="action-buttons-container">
          <a-button id="prev-button" @click="handlePrev" block v-if="currentStep > 0">{{ $t('previous') }}</a-button>
          <a-button id="next-button" @click="handleNext" block v-if="currentStep < 3">{{ $t('next') }}</a-button>
          <a-button id="submit-button" @click="submitWorkOrder" block type="primary" v-if="currentStep >= 3">{{
            $t('submitWorkOrder') }}</a-button>
        </div>
        <!-- </div> -->
      </div>
    </div>
  </a-spin>
</template>

<script>
// @ is an alias to /src
import FormHeader from '../components/FormHeader.vue';
import JobInfoForm from '../components/JobInfoForm.vue';
import WorkOrderForm from '../components/WorkOrderForm.vue';
import WorkOrderPdfTemplate from '../components/WorkOrderPdfTemplate.vue';
import FrenchWorkOrderPdfTemplate from '../components/FrenchWorkOrderPdfTemplate.vue';
import FLHAForm from '../components/FLHAForm.vue';
import axios from 'axios';
import { Modal } from 'ant-design-vue';

export default {
  name: 'HomeView',
  components: {
    FormHeader,
    JobInfoForm,
    WorkOrderForm,
    WorkOrderPdfTemplate,
    FrenchWorkOrderPdfTemplate,
    FLHAForm
  },
  data() {
    return {
      currentStep: 0,
      lang: 'en',
      loader: false,
      isNext: false,
      JobInfo: {
        workOrderDate: '',
        startWorkTime: '',
        companyName: ''
      },
      allTechnicians: [],
      workOrderData: {
        typeOfWork: 'Service Call',
        quotesItems: []
      }
    }
  },
  mounted: async function () {
    this.loader = true;
    this.lang = await this.getLang();
    const dealId = this.$route.query.id;
    console.log("Deal ID: ", dealId);

    // this.workOrderData = {
    //   typeOfWork: 'Service Call',
    //   record_id: '2148988000577845328',
    //   Account_Name: 'Frederick Kirk Mockford Edmonton AB GW130878',
    //   quotesItems: [
    //     {
    //       record_id: '2148988000586241279',
    //       Account_Name: 'Frederick Kirk Mockford Edmonton AB GW130878',
    //       systemType: 'Intrusion Alarm'
    //     },
    //     {
    //       record_id: '2148988000586241285',
    //       Account_Name: 'Frederick Kirk Mockford Edmonton AB GW130878',
    //       systemType: 'Access Control'
    //     },
    //     {
    //       record_id: '2148988000586241281',
    //       Account_Name: 'Frederick Kirk Mockford Edmonton AB GW130878',
    //       systemType: 'Medical (PERS)'
    //     },
    //     {
    //       record_id: '2148988000586241278',
    //       Account_Name: 'Frederick Kirk Mockford Edmonton AB GW130878',
    //       systemType: 'Audio / Visual'
    //     },
    //     {
    //       record_id: '2148988000586241273',
    //       Account_Name: 'Frederick Kirk Mockford Edmonton AB GW130878',
    //       systemType: 'Body Camera'
    //     },
    //     {
    //       record_id: '2148988000586241288',
    //       Account_Name: 'Frederick Kirk Mockford Edmonton AB GW130878',
    //       systemType: 'Nurse Call / Duress'
    //     },
    //     {
    //       record_id: '2148988000586241287',
    //       Account_Name: 'Frederick Kirk Mockford Edmonton AB GW130878'
    //     },
    //     {
    //       record_id: '2148988000586241286',
    //       Account_Name: 'Frederick Kirk Mockford Edmonton AB GW130878'
    //     },
    //     {
    //       record_id: '2148988000586241284',
    //       Account_Name: 'Frederick Kirk Mockford Edmonton AB GW130878'
    //     },
    //     {
    //       record_id: '2148988000586241282',
    //       Account_Name: 'Frederick Kirk Mockford Edmonton AB GW130878'
    //     },
    //     {
    //       record_id: '2148988000586241280',
    //       Account_Name: 'Frederick Kirk Mockford Edmonton AB GW130878'
    //     },
    //     {
    //       record_id: '2148988000586241277',
    //       Account_Name: 'Frederick Kirk Mockford Edmonton AB GW130878'
    //     },
    //     {
    //       record_id: '2148988000586241276',
    //       Account_Name: 'Frederick Kirk Mockford Edmonton AB GW130878'
    //     },
    //     {
    //       record_id: '2148988000586241275',
    //       Account_Name: 'Frederick Kirk Mockford Edmonton AB GW130878'
    //     },
    //     {
    //       record_id: '2148988000586241274',
    //       Account_Name: 'Frederick Kirk Mockford Edmonton AB GW130878'
    //     },
    //     {
    //       record_id: '2148988000586241283',
    //       Account_Name: 'Frederick Kirk Mockford Edmonton AB GW130878'
    //     }
    //   ]
    // }

    if (dealId) {
      try {
        const getDealDetails = await axios.get(`/server/work_order_function/api/crm/deals/${dealId}`);
        console.log("Deal Details: ", getDealDetails);
        if(getDealDetails.data.msg && getDealDetails.data.msg === "Failed to search data") {
          this.errorMessage(this.$t('warnings.noSystemFound'), this.$t('warnings.noSystemFoundWithId'));
          this.loader = false;
          return;
        }

        if (getDealDetails) {
          console.log(getDealDetails);

          if(getDealDetails.data.Technician_Name && getDealDetails.data.Technician_Name !== '') {
            this.JobInfo.technicianName = getDealDetails.data.Technician_Name;
          } else {
            try {
              // const getTechnicians = await axios.get(`/server/work_order_function/api/crm/technicians`);
              // this.allTechnicians = getTechnicians.data;
            } catch (error) {
              console.log("Error getting technician details: ", error);
            }
          }

          this.JobInfo.companyName = getDealDetails.data.Account_Name.name;
          this.JobInfo.contactName = getDealDetails.data.Contact_Name;
          this.JobInfo.siteAddress = getDealDetails.data.Site_Province + ", " + getDealDetails.data.Site_Street + ", " + getDealDetails.data.Site_Postal_Code + ", " + getDealDetails.data.Site_City;

          this.workOrderData.Record_Id = getDealDetails.data.record_id;
          this.workOrderData.Account_Name = getDealDetails.data.Account_Name;
          this.workOrderData.Technician_Name = getDealDetails.data.Technician_Name;
          this.workOrderData.typeOfWork = getDealDetails.data.type_of_work;
          if(getDealDetails.data.Site_System_Types !== null) {
            this.workOrderData.siteSystemType = getDealDetails.data.Site_System_Types.value;
          } else {
            this.workOrderData.siteSystemType = '';
          }
          if (getDealDetails.data.sold_items.length > 0) {
            const modSoldItems = await this.convertKeysToCamelCase(getDealDetails.data.sold_items)
            this.workOrderData.soldItems = modSoldItems;
            this.workOrderData.soldItems = this.workOrderData.soldItems.filter((item) => item.installationStatus !== 'All Items Installed');
            this.workOrderData.soldItems = this.workOrderData.soldItems.map(item => {
                return {
                  ...item
                  // systemType: item.systemType ? this.encodeKey(item.systemType) : this.encodeKey(getDealDetails.data.Site_System_Types.value)
                };
            });
          } else {
            this.workOrderData.soldItems = [];
          }
          if (getDealDetails.data.installed_equipments.length > 0) {
            const modInstalledEquipments = await this.convertKeysToCamelCase(getDealDetails.data.installed_equipments)
            this.workOrderData.installedEquipments = modInstalledEquipments;
            this.workOrderData.installedEquipments = this.workOrderData.installedEquipments.map(item => {
              return {
                ...item
                // systemType: item.systemType ? this.encodeKey(item.systemType) : this.encodeKey(getDealDetails.data.Site_System_Types.value)
              };
            });
          } else {
            this.workOrderData.installedEquipments = [];
          }
        }

        this.loader = false;
        console.log("Work Order from Home: ", this.workOrderData);
      } catch (error) {
        console.log("Error getting deal details: ", error);
        this.errorMessage(this.$t('warnings.noSystemFound'), this.$t('warnings.noSystemFoundWithId'));
        this.loader = false;
      }
    } else {
      this.errorMessage(this.$t('warnings.noSystemFound'), this.$t('warnings.noSystemFoundMsg'));
    }
    // try {
    //   var datastore = catalyst.table;
    //   var table = datastore.tableId('ShipmentTracking');
    //   var row = table.rowId(12781121212121);
    //   var rowPromise = row.get();
    //   rowPromise.then((resp) => {
    //     console.log("Row Promise: ", resp);
    //   }) .catch((e) => {
    //     console.log("Error in promise: ", e);
    //   })
    // } catch (e) {
    //   console.log("Error with web sdk: ", e);
    // }
  },
  methods: {
    handleStepUpdate(step) {
      this.currentStep = parseInt(step);
    },
    handleNext() {
      this.isNext = true;
      this.loader = true;
      setTimeout(() => {
        this.currentStep++;
      }, 100)
    },
    errorMessage(title, content) {
      Modal.error({
        title,content
      });
      this.loader = false;
    },
    encodeKey(key) {
      const isAlphanumeric = /^[a-zA-Z0-9\s]+$/.test(key);
      if (isAlphanumeric) {
        return key.replace(/\s+/g, '');
      }
      return key;
    },
    handlePrev() {
      this.isNext = true;
      this.loader = true;
      setTimeout(() => {
        this.currentStep--;
      }, 100)
    },
    async getLang() {
      // try {
      //   const lang = await axios.get('/server/work_order_function/api/settings/lang');
      //   return lang.data;
      // } catch(e) {
      //     console.log(e);
      //     return 'en';
      // }
      return this.$route.params.lang || 'en';
    },
    toCamelCase(str) {

      return str
        .toLowerCase()
        .replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
    },
    async convertKeysToCamelCase(items) {
      return items.map(item => {
        const newItem = {};
        for (const key in item) {
          const camelCaseKey = this.toCamelCase(key);
          // if (typeof item[key] === 'object' && item[key] !== null && !Array.isArray(item[key])) {
          //     newItem[camelCaseKey] = this.convertKeysToCamelCase([item[key]])[0];
          // } else {
          newItem[camelCaseKey] = item[key];
          // }
        }
        return newItem;
      });
    }
  }
}
</script>

<style>
.all-forms-container {
  padding: 20px;
  /* height: 90vh; */
}

.action-buttons-container {
  display: flex;
  margin-top: 20px;
  width: 97%;
  padding: 15px;
  position: fixed;  /* Fixes the div to the viewport */
  bottom: 0;        /* Positions the div at the bottom of the viewport */
  left: 0;          /* Aligns the div to the left side */
  background-color: #f5f5f5;  /* Background color (example: dark gray) */
  color: white;     /* Text color (example: white) */
  text-align: center; /* Centers the content inside the div */
  z-index: 1000;
}

#next-button {
  background-color: #252929;
  color: whitesmoke;
  font-weight: bold;
}

#next-button:hover {
  background-color: #171a1a;
}

#prev-button {
  margin-right: 10px;
}

#submit-button {
  font-weight: bold;
  background-color: #ea3a34;
}

#submit-button:hover {
  background-color: #e81912;
}

@media only screen and (max-width: 576px) {
  .action-buttons-container {
    width: 93%;
  }

  .all-forms-container {
    padding: 10px;
  }
}

</style>