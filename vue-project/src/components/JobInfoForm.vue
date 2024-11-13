<script setup>
import { PlusOutlined, ClockCircleOutlined, EditFilled } from '@ant-design/icons-vue';
</script>
<template>
    <div class="job-info-form-container">
        <!-- <p>Technicians: {{ technicianDetails }}</p> -->
        <a-modal v-model:open="addTechnicianModal" title="Add New Technician" @ok="">
            <a-form layout="vertical" style="margin-top: 15px;">
                <a-form-item :label="$t('jobInfoForm.technicianName')" name="technicianName">
                    <a-select v-model:value="JobInfo.technicianName" :showSearch="true">
                        <a-select-option v-for="technician in technicianDetails" :value="technician.Technician_Name">{{ technician.Technician_Name }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item :label="$t('jobInfoForm.setStatus')" name="technicianStatus">
                    <a-select v-model:value="JobInfo.technicianStatus" default-value="Technician">
                        <a-select-option value="Lead Technician"></a-select-option>
                        <a-select-option value="Technician">Technician</a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
            <template #footer>
                <a-button key="back" @click="handleCancel">Cancel</a-button>
                <a-button key="submit" type="primary" :loading="loading" @click="addNewTechinicianToCrm">{{ $t('jobInfoForm.addTechnician') }}</a-button>
            </template>
        </a-modal>
        <a-form layout="vertical">
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item :label="$t('jobInfoForm.companyName')" name="companyName">
                        <!-- <a-input v-model:value="JobInfo.companyName" disabled></a-input> -->
                         <div class="custom-disabled-field"><span>{{ JobInfo.companyName }}</span></div>
                         <!-- <div class="custom-disabled-field"><span>Grace AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA Golden Lake ON GW202563</span></div> -->
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('jobInfoForm.workOrderDate')" name="workOrderDate">
                        <a-date-picker :style="{ width: '100%' }" v-model:value="JobInfo.workOrderDate"></a-date-picker>
                    </a-form-item>
                </a-col>
                <!-- <a-col :span="12">
                    <a-form-item :label="$t('jobInfoForm.startWorkTime')" name="startWorkTime">
                        <a-time-picker
                            :style="{ width: '100%' }"
                            v-model:value="JobInfo.startWorkTime"
                        ></a-time-picker>
                    </a-form-item>
                </a-col> -->
            </a-row>
            <!-- <a-row :gutter="20">
                <a-col :span="24">
                    <a-form-item :label="$t('jobInfoForm.companyName')" name="companyName">
                        <a-input v-model:value="JobInfo.companyName" disabled></a-input>
                    </a-form-item>
                </a-col>
            </a-row> -->
            <a-row :gutter="20">
                <!-- <a-col :span="12">
                    <a-form-item :label="$t('jobInfoForm.companyAddress')" name="companyAddress">
                        <a-input v-model:value="JobInfo.companyAddress" disabled></a-input>
                    </a-form-item>
                </a-col> -->
                <a-col :span="12">
                    <a-form-item :label="$t('jobInfoForm.siteContactAddress')" name="siteAddress">
                        <!-- <a-input v-model:value="JobInfo.siteAddress" disabled></a-input> -->
                        <div class="custom-disabled-field"><span>{{ JobInfo.siteAddress }}</span></div>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('jobInfoForm.siteContactName')" name="siteContactName">
                        <!-- <a-input v-model:value="JobInfo.contactName" disabled></a-input> -->
                        <div class="custom-disabled-field"><span>{{ JobInfo.contactName }}</span></div>
                    </a-form-item>
                </a-col>
            </a-row>
            <!-- <a-row :gutter="20">
                <a-col :span="12">
                    <a-form-item :label="$t('jobInfoForm.siteContactAddress')" name="siteAddress">
                        <a-input v-model:value="JobInfo.siteStreet" disabled></a-input>
                    </a-form-item>
                </a-col>
            </a-row> -->
        </a-form>

        <!-- <div class="table-container"> -->
        <!-- <p id="technician-details-title">{{ $t('jobInfoForm.technicianDetails') }}</p>
        <table v-if="JobInfo.technicianName">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Last Start Date/Time</th>
                    <th>Total Time</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="width: 20%;">{{ JobInfo.technicianName }}</td>
                    <td style="width: 20%;">Lead Technician</td>
                    <td style="width: 20%;">2023-10-23 08:00 AM</td>
                    <td style="width: 20%;">5 hrs</td>
                    <td class="action-buttons" style="width: 20%;">
                        <a-button class="btn btn-start" size="small">
                            <ClockCircleOutlined />Start Time
                        </a-button>
                        <a-button class="btn btn-edit" size="small" type="primary">
                            <EditFilled />
                        </a-button>
                    </td>
                </tr>
            </tbody>
        </table>
        <a-button class="add-technician-button" type="primary" v-if="!JobInfo.technicianName"
            @click="openAddTechnicianModal">
            <PlusOutlined />{{ $t('jobInfoForm.addTechnician') }}
        </a-button> -->

        <!-- </div> -->

    </div>
</template>

<script>
export default {
    name: "JobInfoForm",
    props: {
        getJobInfo: Object,
        technicianDetails: Object,
        nextComponent: Boolean
    },
    mounted() {
        if (this.getJobInfo !== undefined) {
            this.JobInfo = this.getJobInfo;
        }
        console.log("All Technicians: ", this.technicianDetails);

        if (this.nextComponent) {
            setTimeout(() => {
                this.$emit('loader', false)
            }, 100)
        }
    },
    data() {
        return {
            JobInfo: {
                workOrderDate: '',
                startWorkTime: '',
                companyName: '',
                companyAddress: '',
                contactName: '',
                siteAddress: '',
            },
            addTechnicianModal: false
        }
    },
    methods: {
        openAddTechnicianModal() {
            this.addTechnicianModal = true;
        },
        addNewTechinicianToCrm() {
            this.addTechnicianModal = false;
        }
    }
}
</script>

<style>
.job-info-form-container {
    /* width: 95%; */
    height: 63vh;
    overflow: auto;
    background-color: white;
    border-radius: 10px;
    padding: 20px 30px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

.ant-table-wrapper .ant-table.ant-table-bordered>.ant-table-container>.ant-table-content>table>thead>tr>th {
    /* border-inline-end: 2x solid #ed1c24 !important;
    border-bottom: 3px solid #eb4747 !important; */
    background-color: #434343;
    color: whitesmoke;
}

#technician-details-title {
    font-size: 14px;
    margin-bottom: 15px;
    font-weight: 500;
}

.table-container {
    /* width: 90%; */
    max-width: 1200px;
    overflow-x: auto;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;
}

.add-technician-button {
    /* display: inline-block;
      margin-bottom: 15px;
      padding: 10px 16px; */
    margin-top: 15px;
    background-color: #ea3a34;
    /* color: white;
      text-transform: uppercase;
      font-weight: bold;
      font-size: 12px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s; */
}

.add-technician-button:hover {
    background-color: #f41a13 !important;
}

.custom-disabled-field {
    width: 98%;
    overflow-x: hidden;
    overflow-y: hidden;
    height: 30px;
    border: 1px solid #d9d9d9;
    border-radius: 7px;
    display: flex;
    /* align-items: center; */
    padding-left: 10px;
    padding-right: -10px;
    cursor: text;
    word-break: break-all;
    overflow-wrap: break-word;
}

.custom-disabled-field span {
    margin-top: 4px;
}

/* Table Styling */
/* table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    border-radius: 10px;
    overflow: hidden;
}

thead {
    background-color: #434343;
    color: white;
}

th,
td {
    padding: 12px 16px;
    text-align: left;
    font-size: 12px;
}

th {
    text-transform: uppercase;
    font-weight: 600;
}

tbody tr {
    border-bottom: 1px solid #ddd;
    transition: background-color 0.3s;
}

tbody tr:hover {
    background-color: #f1f1f1;
} */

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: 8px;
}

/* .btn {
        padding: 6px 12px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        color: white;
        transition: background-color 0.3s;
        }

        .btn-start {
        background-color: #28a745;
        }

        .btn-start:hover {
        background-color: #218838;
        }



        .btn-edit:hover {
        background-color: #0069d9;
        } */
        .btn-edit {
        background-color: #007bff;
        }

@media only screen and (max-width: 576px) {
    .job-info-form-container {
        padding: 20px;
        height: 72vh
    }
}
</style>