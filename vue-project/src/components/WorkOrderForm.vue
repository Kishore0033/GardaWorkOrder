<script setup>
import { MinusCircleOutlined, PlusOutlined, DeleteFilled, ToolFilled, SecurityScanFilled, EditFilled, SettingFilled, LeftCircleFilled, RightCircleFilled } from '@ant-design/icons-vue';
import { Account } from 'aws-sdk';
import axios from 'axios';
import { message } from 'ant-design-vue';
</script>

<template>
    <div class="work-order-form-container">
        <!-- :title="'Add ' + workOrderData.typeOfWork === 'New Installation' ? $t('workOrderForm.soldItems') : workOrderData.typeOfWork === 'Service Call' ? $t('workOrderForm.installedEquipments') : $t('workOrderForm.quotesItems')" -->
        <a-modal
            v-model:open="openAddEquipment"
            title="Add New Equipment"
        >
            <template #footer>
                <a-button type="primary" style="background-color: #252929;" @click="showPreviousItem" :disabled="disablePreviousButton"><LeftCircleFilled />{{ $t('workOrderForm.previous') }}</a-button>
                <a-button type="primary" style="background-color: #252929;" @click="showNextItem" :disabled="disableNextButton"><RightCircleFilled />{{ $t('workOrderForm.next') }}</a-button>
                <a-button type="primary" :loading="installingEquipment" style="background-color: #e84540;" @click="installEquipment"><SettingFilled />{{ $t('workOrderForm.install') }}</a-button>
            </template>
            <a-form layout="vertical" style="margin-top: 15px;">
                <a-form-item :label="'Product Name'">
                    <a-input placeholder="" v-model:value="currentSoldItem.productName" />
                </a-form-item>
                <a-form-item v-for="field in dynamicFields[stringToPascalCase(workOrderData.siteSystemType)]"
                    :label="$t(`workOrderForm.${camelCase(field)}`)">
                    <!-- <a-input placeholder="" v-model:value="item[camelCase(field)]" /> -->
                    <a-select v-if="dropDownFields.hasOwnProperty(field)" v-model:value="currentSoldItem[camelCase(field)]" :showSearch="true">
                        <a-select-option v-for="value in dropDownFields[field]" :value="value">{{ value }}</a-select-option>
                     </a-select>
                    <a-input placeholder="" v-model:value="currentSoldItem[camelCase(field)]" v-else />
                </a-form-item>
            </a-form>
        </a-modal>
        <a-modal v-model:open="mobileViewMode.openAddItemModel"
            title="Add New Equipment"
            @ok="addNewItemMobile" :afterClose="handleAddItemCancel">
            <template #footer>
                <a-button key="back" :loading="mobileViewMode.canceling" @click="handleAddItemCancel">{{
                    $t('workOrderForm.cancel') }}</a-button>
                <a-button v-if="!mobileViewMode.isEditMode" key="submit" type="primary" @click="addNewItemMobile">{{
                    $t('workOrderForm.addItem') }}</a-button>
                <a-button v-if="mobileViewMode.isEditMode" key="submit" type="primary" @click="updateNewItemMobile">{{
                    $t('workOrderForm.updateItem') }}</a-button>
            </template>
            <a-form-item :label="$t('workOrderForm.systemType')" name="systemType"
                style="display: block; width: 100%; margin-right: 10px;">
                <a-select v-model:value="mobileViewMode.newQuotesItem['systemType']"
                    :placeholder="$t('workOrderForm.selectSystemType')">
                    <a-select-option v-for="(field, key) in dynamicFields" :value="key">{{ formatKey(key)
                        }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item v-for="field in dynamicFields[mobileViewMode.newQuotesItem.systemType]"
                :label="$t(`workOrderForm.${camelCase(field)}`)"
                style="display: block; width: 100%; margin-right: 10px;">
                <a-input placeholder="" v-model:value="mobileViewMode.newQuotesItem[camelCase(field)]" />
            </a-form-item>
        </a-modal>
        <a-form layout="vertical">
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item :label="$t('workOrderForm.typeOfWork')" name="typeOfWork">
                        <a-select v-model:value=workOrderData.typeOfWork style="width: 100%"
                            :placeholder="$t('workOrderForm.selectTypeOfWork')">
                            <a-select-option :value="'Service Call'">Service Call</a-select-option>
                            <a-select-option :value="'New Installation'">New Installation</a-select-option>
                            <a-select-option :value="'Inspection'">Inspection</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <div class="quotes-items-container">
                <div class="quotes-items-header">
                    <p>
                        <span>
                            {{ $t('workOrderForm.soldItems') }}
                        </span>
                        <span v-if="workOrderData.soldItems"
                            style="margin-left: 10px; background-color: #e84540; color: white; font-weight: bold; padding: 1px 6px; border-radius: 2px; font-size: 12px;">{{
                                workOrderData.soldItems.length }}</span>
                    </p>
                </div>
                <div class="sub-form-wrapper">
                    <!-- <a-space class="item-row" v-for="(item, index) in workOrderData.quotesItems" :key="item.id"
                        v-if="!mobileViewMode.mobileView">
                        <a-form-item :label="$t('workOrderForm.systemType')" style="width: 150px;">
                            <a-select v-model:value="item.systemType"
                                :placeholder="$t('workOrderForm.selectSystemType')">
                                <a-select-option v-for="(field, key) in dynamicFields" :value="key">{{ formatKey(key)
                                    }}</a-select-option>
                            </a-select>
                        </a-form-item>
                        <div class="dynamic-fields-container"
                            :style="{ display: 'flex', width: (screenWidth - 355) + 'px', overflowY: 'auto' }">
                            <a-form-item v-for="field in dynamicFields[item.systemType]"
                                :label="$t(`workOrderForm.${camelCase(field)}`)"
                                style="width: 150px; margin-right: 10px;">
                                <a-input placeholder="" v-model:value="item[camelCase(field)]" />
                            </a-form-item>
                        </div>
                        <div class="delete-action-container">
                            <a-popconfirm title="Are you sure delete this task?" ok-text="Yes" ok-type="danger"
                                cancel-text="No" @confirm="removeItem(item)">
                                <DeleteFilled class="delete-action-icon" />
                            </a-popconfirm>
                        </div>
                    </a-space> -->
                    <div v-if="!mobileViewMode.mobileView">
                        <a-table v-if="workOrderData.soldItems.length > 0" :dataSource="workOrderData.soldItems" :columns="columns"
                            :style="{ width: '100%' }" :pagination="false" bordered>
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.key === 'action'">
                                    <span>
                                        <a-button size="small" type="primary" style="background-color: #ea3a34;" @click="openAddEquipmentModal(index)"><SettingFilled />{{ $t('workOrderForm.install') }}</a-button>
                                    </span>
                                </template>
                            </template>
                        </a-table>
                    </div>
                    <div class="item-main-details-container" v-else>
                        <a-card size="small" class="item-details-card" v-for="(item, index) in workOrderData.soldItems"
                            :key="item.id" :title="'Product Name'">
                        <!-- <a-card size="small" class="item-details-card" v-for="(item, index) in workOrderData.soldItems"
                            :key="item.id" :title="item.systemType ? formatKey(item.systemType) : ''"> -->
                            <template #extra>
                                <a href="#" style="margin-right: 15px;" @click="editQuotesItem(index)">
                                    <EditFilled />
                                </a>
                                <a-popconfirm title="Are you sure delete this task?" ok-text="Yes" ok-type="danger"
                                    cancel-text="No" @confirm="removeItem(item)">
                                    <a style="color: #ea3a34;">
                                        <DeleteFilled />
                                    </a>
                                </a-popconfirm>
                            </template>
                            <table class="sold-items-table">
                                <!-- <tr v-if="!mobileViewMode.showingAllItems[index]"
                                    v-for="field in lessDynamicFields[item.systemType]">
                                    <th style="padding-right: 20px; text-align: left; font-size: 12px;">{{
                                        $t(`workOrderForm.${camelCase(field)}`) }}</th>
                                    <td style="font-size: 12px;">{{ item[camelCase(field)] }}</td>
                                </tr>
                                <tr v-else v-for="field in dynamicFields[item.systemType]">
                                    <th style="padding-right: 20px; text-align: left; font-size: 12px;">{{
                                        $t(`workOrderForm.${camelCase(field)}`) }}</th>
                                    <td style="font-size: 12px;">{{ item[camelCase(field)] }}</td>
                                </tr> -->
                                <tr>
                                    <th>
                                        Product Name
                                    </th>
                                    <td>

                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        SKU
                                    </th>
                                    <td>

                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        Zone
                                    </th>
                                    <td>

                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        Status
                                    </th>
                                    <td>

                                    </td>
                                </tr>
                            </table>
                            <div :style="{ textAlign: 'center', marginTop: '2px', height: '30px', lineHeight: '32px' }">
                                <!-- <a-button v-if="!mobileViewMode.showingAllItems[index]" @click="onLoadMore(index)"
                                    type="primary" size="small"><span style="font-size: 12px;">{{
                                        $t(`workOrderForm.showAll`)
                                    }}</span></a-button>
                                <a-button v-else @click="onLoadLess(index)" type="primary" size="small"><span
                                        style="font-size: 12px;">{{ $t(`workOrderForm.showLess`) }}</span></a-button> -->
                                        <a-button type="primary" size="small"><span
                                            style="font-size: 12px;">{{ $t(`workOrderForm.install`) }}</span></a-button>
                            </div>
                        </a-card>
                    </div>
                    <div id="sub-form-add-button-container" :style="workOrderData.soldItems.length > 0 ? {borderTop: '1px solid #cbcbcb' } : {}">
                        <a-button type="dashed" size="small" id="sub-form-add-button" @click="addItem"
                            v-if="!mobileViewMode.mobileView">
                            <PlusOutlined />
                            <span style="font-weight: 400;">{{ $t('workOrderForm.addItem') }}</span>
                        </a-button>
                        <a-button type="dashed" size="small" id="sub-form-add-button" @click="addItemMobile()" v-else>
                            <PlusOutlined />
                            <span style="font-weight: 400;">{{ $t('workOrderForm.addItem') }}</span>
                        </a-button>
                    </div>
                </div>
            </div>
            <div class="quotes-items-container" style="margin-top: 30px;">
                <div class="quotes-items-header">
                    <p>
                        <span>
                            {{ $t('workOrderForm.installedEquipments') }}
                        </span>
                        <span v-if="workOrderData.installedEquipments"
                            style="margin-left: 10px; background-color: #e84540; color: white; font-weight: bold; padding: 1px 6px; border-radius: 2px; font-size: 12px;">{{
                                workOrderData.installedEquipments.length }}</span>
                    </p>
                </div>
                <div class="sub-form-wrapper">
                    <a-space class="item-row" v-for="(item, index) in workOrderData.installedEquipments" :key="item.id" v-if="!mobileViewMode.mobileView">
                        <a-form-item :label="$t('workOrderForm.productName')" style="width: 150px;">
                            <a-input placeholder="" v-model:value="item['productName']" />
                        </a-form-item>
                        <div class="dynamic-fields-container"
                            :style="{ display: 'flex', width: (screenWidth - 390) + 'px', overflowY: 'auto', marginLeft: '-30px' }">
                            <!-- <a-form-item label="Product Name" style="width: 150px; margin-right: 10px;">
                                <a-input placeholder="" v-model:value="item['productName']" />
                            </a-form-item> -->
                            <a-form-item label="SKU" style="width: 150px; margin-right: 10px;">
                                <a-input placeholder="" v-model:value="item['sku']" />
                            </a-form-item>
                            <a-form-item v-for="field in dynamicFields[stringToPascalCase(workOrderData.siteSystemType)]"
                                :label="$t(`workOrderForm.${camelCase(field)}`)"
                                style="width: 150px; margin-right: 10px;">
                                <a-select v-if="dropDownFields.hasOwnProperty(field)" v-model:value="item[camelCase(field)]" :showSearch="true">
                                    <a-select-option v-for="value in dropDownFields[field]" :value="value">{{ value }}</a-select-option>
                                </a-select>
                                <a-input placeholder="" v-model:value="item[camelCase(field)]" v-else />
                            </a-form-item>
                        </div>
                        <div class="delete-action-container">
                            <a-popconfirm
                                title="Are you sure delete this task?"
                                ok-text="Yes"
                                ok-type="danger"
                                cancel-text="No"
                                @confirm="removeItem(item)"
                            >
                                <DeleteFilled class="delete-action-icon" />
                            </a-popconfirm>
                        </div>
                    </a-space>
                    <!-- <a-space v-if="!mobileViewMode.mobileView" style="width: 100%; background-color: #e84540;"> -->
                    <!-- <a-table v-if="!mobileViewMode.mobileView" :dataSource="workOrderData.installedEquipments"
                        :columns="columns" :style="{ width: '100%' }" :pagination="false" bordered>
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.key === 'action'">
                                <span>
                                    <a-button size="small"><EditFilled />{{ $t('workOrderForm.edit') }}</a-button>
                                </span>
                            </template>
                        </template>
                    </a-table> -->
                    <!-- </a-space> -->
                    <div class="item-main-details-container" v-else>
                        <a-card size="small" class="item-details-card"
                            v-for="(item, index) in workOrderData.installedEquipments" :key="item.id"
                            :title="item.systemType ? formatKey(item.systemType) : ''">
                            <template #extra>
                                <a href="#" style="margin-right: 15px;" @click="editQuotesItem(index)">
                                    <EditFilled />
                                </a>
                                <a-popconfirm title="Are you sure delete this task?" ok-text="Yes" ok-type="danger"
                                    cancel-text="No" @confirm="removeItem(item)">
                                    <a style="color: #ea3a34;">
                                        <DeleteFilled />
                                    </a>
                                </a-popconfirm>
                            </template>
                            <table>
                                <tr v-if="!mobileViewMode.showingAllItems[index]"
                                    v-for="field in lessDynamicFields[item.systemType]">
                                    <th style="padding-right: 20px; text-align: left; font-size: 12px;">{{
                                        $t(`workOrderForm.${camelCase(field)}`) }}</th>
                                    <td style="font-size: 12px;">{{ item[camelCase(field)] }}</td>
                                </tr>
                                <tr v-else v-for="field in dynamicFields[item.systemType]">
                                    <th style="padding-right: 20px; text-align: left; font-size: 12px;">{{
                                        $t(`workOrderForm.${camelCase(field)}`) }}</th>
                                    <td style="font-size: 12px;">{{ item[camelCase(field)] }}</td>
                                </tr>
                            </table>
                            <div :style="{ textAlign: 'center', marginTop: '2px', height: '30px', lineHeight: '32px' }">
                                <a-button v-if="!mobileViewMode.showingAllItems[index]" @click="onLoadMore(index)"
                                    type="primary" size="small"><span style="font-size: 12px;">{{
                                        $t(`workOrderForm.showAll`)
                                    }}</span></a-button>
                                <a-button v-else @click="onLoadLess(index)" type="primary" size="small"><span
                                        style="font-size: 12px;">{{ $t(`workOrderForm.showLess`) }}</span></a-button>
                            </div>
                        </a-card>
                    </div>
                    <!-- <div id="sub-form-add-button-container">
                        <a-button type="dashed" size="small" id="sub-form-add-button" @click="addItem"
                            v-if="!mobileViewMode.mobileView">
                            <PlusOutlined />
                            <span style="font-weight: 400;">{{ $t('workOrderForm.addItem') }}</span>
                        </a-button>
                        <a-button type="dashed" size="small" id="sub-form-add-button" @click="addItemMobile()" v-else>
                            <PlusOutlined />
                            <span style="font-weight: 400;">{{ $t('workOrderForm.addItem') }}</span>
                        </a-button>
                    </div> -->
                </div>
            </div>
        </a-form>
    </div>
</template>

<script>
export default {
    name: "WorkOrderForm",
    props: {
        getWorkOrder: Object
    },
    mounted() {
        if (this.getWorkOrder !== undefined) {
            this.workOrderData = this.getWorkOrder;
        }

        // this.workOrderData = {
        //     "typeOfWork": "Service Call",
        //     "recordId": "2148988000577845328",
        //     "Site_City": "Edmonton",
        //     "Site_Street": "9204 90 Ave NW",
        //     "siteSystemType": "Intrusion Alarm",
        //     "Contact_Phone": "7809075607",
        //     "accountName": "Frederick Kirk Mockford Edmonton AB GW130878",
        //     "Technician_Name": "MC Installations (Matt Collier)",
        //     "Contact_Name": "Frederick Kirk Mockford",
        //     "soldItems": [
        //         {
        //             "recordId": "2148988000577935259",
        //             "productName": "GSM",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             }
        //         },
        //         {
        //             "recordId": "2148988000577935258",
        //             "productName": "GE Simon XTi-5",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             }
        //         },
        //         {
        //             "recordId": "2148988000577935257",
        //             "productName": "GE Simon XTi-5",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             }
        //         },
        //         {
        //             "recordId": "2148988000577935256",
        //             "productName": "GSM",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             }
        //         }
        //     ],
        //     "installedEquipments": [
        //         {
        //             "recordId": "2148988000586241279",
        //             "alarmType": "Smoke/Heat/Fire",
        //             "status": "Installed",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "New_Existing": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "Zone": "6",
        //             "deviceType": "Smoke",
        //             "part": "QS5110-840 - Qolsys Smoke",
        //             "serviced": "No",
        //             "Location": "Hallway Smoke Detector"
        //         },
        //         {
        //             "recordId": "2148988000586241285",
        //             "alarmType": null,
        //             "status": "Installed",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "New_Existing": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "Zone": "Automation",
        //             "deviceType": "Other",
        //             "part": "GR-105 - Water Shut Off Valve",
        //             "serviced": "No",
        //             "Location": "Water Valve"
        //         },
        //         {
        //             "recordId": "2148988000586241281",
        //             "alarmType": "Water",
        //             "status": "Installed",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "New_Existing": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "Zone": "8",
        //             "deviceType": "Flood",
        //             "part": "QS5536-840 - Qolsys Flood Sensor",
        //             "serviced": "No",
        //             "Location": "Utility Room Flood"
        //         },
        //         {
        //             "recordId": "2148988000586241278",
        //             "alarmType": "Burglary",
        //             "status": "Installed",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "New_Existing": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "Zone": "5",
        //             "deviceType": "Motion",
        //             "part": "QS1231-840 - Qolsys Motion S-Line",
        //             "serviced": "No",
        //             "Location": "Motion Detector"
        //         },
        //         {
        //             "recordId": "2148988000586241273",
        //             "alarmType": null,
        //             "status": "Installed",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "New_Existing": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "Zone": "Panel",
        //             "deviceType": "Panel",
        //             "part": "IQP4007 - Qolsys Telus IQ Panel 4 PowerG + 319.5MHz",
        //             "serviced": "No",
        //             "Location": "SYSTEM"
        //         },
        //         {
        //             "recordId": "2148988000586241288",
        //             "alarmType": null,
        //             "status": "Installed",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "New_Existing": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "Zone": "Automation",
        //             "deviceType": "Camera",
        //             "part": "ADC-V724 - ADC Outdoor Camera",
        //             "serviced": "No",
        //             "Location": "2. Back"
        //         },
        //         {
        //             "recordId": "2148988000586241287",
        //             "alarmType": null,
        //             "status": "Installed",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "New_Existing": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "Zone": "Automation",
        //             "deviceType": "Camera",
        //             "part": "ADC-V724 - ADC Outdoor Camera",
        //             "serviced": "No",
        //             "Location": "1. Front"
        //         },
        //         {
        //             "recordId": "2148988000586241286",
        //             "alarmType": null,
        //             "status": "Installed",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "New_Existing": "Existing",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "Zone": "Automation",
        //             "deviceType": "Camera",
        //             "part": "ADC-VDB105 - ADC Skybell Slimline Silver (Discontinued)",
        //             "serviced": "No",
        //             "Location": "Front Doorbell"
        //         },
        //         {
        //             "recordId": "2148988000586241284",
        //             "alarmType": "Water",
        //             "status": "Installed",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "New_Existing": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "Zone": "11",
        //             "deviceType": "Flood",
        //             "part": "QS5536-840 - Qolsys Flood Sensor",
        //             "serviced": "No",
        //             "Location": "Bathroom Flood 2"
        //         },
        //         {
        //             "recordId": "2148988000586241282",
        //             "alarmType": "Water",
        //             "status": "Installed",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "New_Existing": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "Zone": "9",
        //             "deviceType": "Flood",
        //             "part": "QS5536-840 - Qolsys Flood Sensor",
        //             "serviced": "No",
        //             "Location": "Laundry Room Flood"
        //         },
        //         {
        //             "recordId": "2148988000586241280",
        //             "alarmType": "Water",
        //             "status": "Installed",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "New_Existing": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "Zone": "7",
        //             "deviceType": "Flood",
        //             "part": "QS5536-840 - Qolsys Flood Sensor",
        //             "serviced": "No",
        //             "Location": "Dishwasher Flood"
        //         },
        //         {
        //             "recordId": "2148988000586241277",
        //             "alarmType": "Burglary",
        //             "status": "Installed",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "New_Existing": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "Zone": "4",
        //             "deviceType": "Window",
        //             "part": "QS1135-840 - Qolsys Door S-Line Sensor (White)",
        //             "serviced": "No",
        //             "Location": "Basement Bedroom Window"
        //         },
        //         {
        //             "recordId": "2148988000586241276",
        //             "alarmType": "Burglary",
        //             "status": "Installed",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "New_Existing": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "Zone": "3",
        //             "deviceType": "Window",
        //             "part": "QS1135-840 - Qolsys Door S-Line Sensor (White)",
        //             "serviced": "No",
        //             "Location": "Basement Window"
        //         },
        //         {
        //             "recordId": "2148988000586241275",
        //             "alarmType": "Burglary",
        //             "status": "Installed",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "New_Existing": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "Zone": "2",
        //             "deviceType": "Door",
        //             "part": "QS1135-840 - Qolsys Door S-Line Sensor (White)",
        //             "serviced": "No",
        //             "Location": "Back Door"
        //         },
        //         {
        //             "recordId": "2148988000586241274",
        //             "alarmType": "Burglary",
        //             "status": "Installed",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "New_Existing": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "Zone": "1",
        //             "deviceType": "Door",
        //             "part": "QS1135-840 - Qolsys Door S-Line Sensor (White)",
        //             "serviced": "No",
        //             "Location": "Front Door"
        //         },
        //         {
        //             "recordId": "2148988000586241283",
        //             "alarmType": "Water",
        //             "status": "Installed",
        //             "Deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "New_Existing": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "Zone": "10",
        //             "deviceType": "Flood",
        //             "part": "QS5536-840 - Qolsys Flood Sensor",
        //             "serviced": "No",
        //             "Location": "Bathroom Flood"
        //         }
        //     ]
        // };

        // this.workOrderData = {
        //     "typeOfWork": "Service Call",
        //     "quotesItems": [],
        //     "siteSystemType": "Intrusion Alarm",
        //     "soldItems": [
        //         {
        //             "recordId": "2148988000577935259",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "productName": "ADC Video",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000577935258",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "productName": "Outdoor Camera",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000577935257",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "productName": "Smoke Detector",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000577935256",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "productName": "Shut Off Valve",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000577935255",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "productName": "Flood Sensor",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000577935254",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "productName": "Motion Detector",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000577935253",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "productName": "Door/Window Contact",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000577935252",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "productName": "GSM",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000577935251",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "productName": "Qolsys IQ 4",
        //             "systemType": "IntrusionAlarm"
        //         }
        //     ],
        //     "installedEquipments": [
        //         {
        //             "recordId": "2148988000586241288",
        //             "alarmType": null,
        //             "status": "Installed",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "newExisting": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "zone": "Automation",
        //             "deviceType": "Camera",
        //             "productName": "ADC Video",
        //             "part": "ADC-V724 - ADC Outdoor Camera",
        //             "sku": "ADC-V724",
        //             "serviced": "No",
        //             "location": "2. Back",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000586241279",
        //             "alarmType": "Smoke/Heat/Fire",
        //             "status": "Installed",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "newExisting": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "zone": "6",
        //             "deviceType": "Smoke",
        //             "part": "QS5110-840 - Qolsys Smoke",
        //             "sku": "QS5110-840",
        //             "serviced": "No",
        //             "location": "Hallway Smoke Detector",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000586241285",
        //             "alarmType": null,
        //             "status": "Installed",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "newExisting": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "zone": "Automation",
        //             "deviceType": "Other",
        //             "part": "GR-105 - Water Shut Off Valve",
        //             "sku": "GR-105",
        //             "serviced": "No",
        //             "location": "Water Valve",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000586241281",
        //             "alarmType": "Water",
        //             "status": "Installed",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "newExisting": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "zone": "8",
        //             "deviceType": "Flood",
        //             "part": "QS5536-840 - Qolsys Flood Sensor",
        //             "sku": "QS5536-840",
        //             "serviced": "No",
        //             "location": "Utility Room Flood",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000586241278",
        //             "alarmType": "Burglary",
        //             "status": "Installed",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "newExisting": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "zone": "5",
        //             "deviceType": "Motion",
        //             "part": "QS1231-840 - Qolsys Motion S-Line",
        //             "sku": "QS1231-840",
        //             "serviced": "No",
        //             "location": "Motion Detector",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000586241273",
        //             "alarmType": null,
        //             "status": "Installed",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "newExisting": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "zone": "Panel",
        //             "deviceType": "Panel",
        //             "part": "IQP4007 - Qolsys Telus IQ Panel 4 PowerG + 319.5MHz",
        //             "sku": "IQP4007",
        //             "serviced": "No",
        //             "location": "SYSTEM",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000586241287",
        //             "alarmType": null,
        //             "status": "Installed",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "newExisting": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "zone": "Automation",
        //             "deviceType": "Camera",
        //             "part": "ADC-V724 - ADC Outdoor Camera",
        //             "sku": "ADC-V724",
        //             "serviced": "No",
        //             "location": "1. Front",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000586241286",
        //             "alarmType": null,
        //             "status": "Installed",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "newExisting": "Existing",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "zone": "Automation",
        //             "deviceType": "Camera",
        //             "part": "ADC-VDB105 - ADC Skybell Slimline Silver (Discontinued)",
        //             "sku": "ADC-VDB105",
        //             "serviced": "No",
        //             "location": "Front Doorbell",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000586241284",
        //             "alarmType": "Water",
        //             "status": "Installed",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "newExisting": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "zone": "11",
        //             "deviceType": "Flood",
        //             "part": "QS5536-840 - Qolsys Flood Sensor",
        //             "sku": "QS5536-840",
        //             "serviced": "No",
        //             "location": "Bathroom Flood 2",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000586241282",
        //             "alarmType": "Water",
        //             "status": "Installed",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "newExisting": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "zone": "9",
        //             "deviceType": "Flood",
        //             "part": "QS5536-840 - Qolsys Flood Sensor",
        //             "sku": "QS5536-840",
        //             "serviced": "No",
        //             "location": "Laundry Room Flood",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000586241280",
        //             "alarmType": "Water",
        //             "status": "Installed",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "newExisting": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "zone": "7",
        //             "deviceType": "Flood",
        //             "part": "QS5536-840 - Qolsys Flood Sensor",
        //             "sku": "QS5536-840",
        //             "serviced": "No",
        //             "location": "Dishwasher Flood",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000586241277",
        //             "alarmType": "Burglary",
        //             "status": "Installed",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "newExisting": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "zone": "4",
        //             "deviceType": "Window",
        //             "part": "QS1135-840 - Qolsys Door S-Line Sensor (White)",
        //             "sku": "QS1135-840",
        //             "serviced": "No",
        //             "location": "Basement Bedroom Window",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000586241276",
        //             "alarmType": "Burglary",
        //             "status": "Installed",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "newExisting": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "zone": "3",
        //             "deviceType": "Window",
        //             "part": "QS1135-840 - Qolsys Door S-Line Sensor (White)",
        //             "sku": "QS1135-840",
        //             "serviced": "No",
        //             "location": "Basement Window",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000586241275",
        //             "alarmType": "Burglary",
        //             "status": "Installed",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "newExisting": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "zone": "2",
        //             "deviceType": "Door",
        //             "part": "QS1135-840 - Qolsys Door S-Line Sensor (White)",
        //             "sku": "QS1135-840",
        //             "serviced": "No",
        //             "location": "Back Door",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000586241274",
        //             "alarmType": "Burglary",
        //             "status": "Installed",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "newExisting": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "zone": "1",
        //             "deviceType": "Door",
        //             "part": "QS1135-840 - Qolsys Door S-Line Sensor (White)",
        //             "sku": "QS1135-840",
        //             "serviced": "No",
        //             "location": "Front Door",
        //             "systemType": "IntrusionAlarm"
        //         },
        //         {
        //             "recordId": "2148988000586241283",
        //             "alarmType": "Water",
        //             "status": "Installed",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "newExisting": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "zone": "10",
        //             "deviceType": "Flood",
        //             "part": "QS5536-840 - Qolsys Flood Sensor",
        //             "sku": "QS5536-840",
        //             "serviced": "No",
        //             "location": "Bathroom Flood",
        //             "systemType": "IntrusionAlarm"
        //         }
        //     ]
        // }

        // this.workOrderData = {
        //     "typeOfWork": "Service Call",
        //     "quotesItems": [],
        //     "siteSystemType": "Intrusion Alarm",
        //     "soldItems": [
        //         {
        //             "recordId": "2148988000577935259",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "installationStatus": "Installed",
        //             "productName": "ADC Video",
        //         }
        //     ],
        //     "installedEquipments": [
        //         {
        //             "recordId": "2148988000586241288",
        //             "alarmType": null,
        //             "status": "Installed",
        //             "deal": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "newExisting": "New",
        //             "wiredWireless": "Wireless",
        //             "accountName": {
        //                 "keyValues": {},
        //                 "keyModified": {}
        //             },
        //             "zone": "Automation",
        //             "deviceType": "Camera",
        //             "productName": "ADC Video",
        //             "part": "ADC-V724 - ADC Outdoor Camera",
        //             "sku": "ADC-V724",
        //             "serviced": "No",
        //             "location": "2. Back",
        //             "systemType": "IntrusionAlarm"
        //         }
        //     ]
        // }
        console.log("Work Order Data: ", this.workOrderData);

        setTimeout(() => {
            this.$emit('loader', false);
        }, 100);

        Object.keys(this.dynamicFields).forEach(key => {
            this.lessDynamicFields[key] = this.dynamicFields[key].slice(0, 3);
        });

        // for (let i = 0; i < this.workOrderData.quotesItems.length; i++) {
        //     this.mobileViewMode.showingAllItems[i] = false;
        // }

        this.updateScreenWidth();
        window.addEventListener('resize', this.updateScreenWidth);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.updateScreenWidth);
    },
    data() {
        return {
            screenWidth: window.innerWidth,
            openAddEquipment: false,
            currentSoldItem: {},
            disableNextButton: false,
            disablePreviousButton: false,
            installingEquipment: false,
            mobileViewMode: {
                mobileView: false,
                showingAllItems: [],
                currentOpenedItem: undefined,
                newQuotesItem: {},
                isEditMode: false,
                openAddItemModel: false,
                oldData: {},
                canceling: false
            },
            workOrderData: {
                typeOfWork: undefined,
                soldItems: [],
                installedEquipments: []
            },
            dynamicFields: {
                IntrusionAlarm: ["Zone", "Serviced", "Device Type", "Alarm Type", "Status", "Location", "Part #", "New/Existing", "Wired/Wireless"],
                VideoSurveillance: ["Zone", "Serviced", "Device Type", "Status", "Location", "Part #", "New/Existing", "Wired/Wireless", "Username", "Password", "DDNS", "Forwarded Ports", "Serial / MAC Address", "IP Address"],
                AccessControl: ["Zone", "Serviced", "Device Type", "Status", "Location", "Part #", "New/Existing", "Wired/Wireless", "Serial / MAC Address", "IP Address", "Related Door Hardware ID", "Door Hardware Type", "Related Reader ID"],
                FirePanel: ["Zone", "Serviced", "Device Type", "Alarm Type", "Status", "Location", "Part #", "New/Existing", "Wired/Wireless"],
                'Audio / Visual': ["Zone", "Serviced", "Device Type", "Status", "Location", "Part #", "New/Existing", "Wired/Wireless"],
                BodyCamera: ["Zone", "Serviced", "Device Type", "Status", "Location", "Part #", "New/Existing", "Wired/Wireless"],
                Elevator: ["Zone", "Serviced", "Device Type", "Alarm Type", "Status", "Location", "Part #", "New/Existing", "Wired/Wireless"],
                EmergencyLineAnsweringService: ["Zone", "Serviced", "Device Type", "Status", "Location", "Part #", "New/Existing", "Wired/Wireless"],
                'Medical (PERS)': ["Zone", "Serviced", "Device Type", "Alarm Type", "Status", "Location", "Part #", "New/Existing", "Wired/Wireless"],
                'Mobile Surveillance Unit (MSU)': ["Zone", "Serviced", "Device Type", "Status", "Location", "Part #", "New/Existing", "Wired/Wireless"],
                'Nurse Call / Duress': ["Zone", "Serviced", "Device Type", "Alarm Type", "Status", "Location", "Part #", "New/Existing", "Wired/Wireless"],
                Parking: ["Zone", "Serviced", "Device Type", "Status", "Location", "Part #", "New/Existing", "Wired/Wireless"],
                Telephony: ["Zone", "Serviced", "Device Type", "Status", "Location", "Part #", "New/Existing", "Wired/Wireless"]
            },
            dropDownFields: {
                'Door Hardware Type': ["Standard Strike", "RIM Strike", "Mag Lock", "Other"],
                'Device Type': ["Access Credential", "Amp / Reciever", "Appliance Module", "Camera", "Carbon Monoxide", "Controller / Expansion Module", "Door", "Doorlock", "Extender / Splitter", "Flood", "Freeze", "Glassbreak", "GSM", "Hard Drive", "Heat", "Image Motion", "Keyfob", "Keypad", "Medical Pendant", "Motion", "Mount / Bracket", "Network Switch", "Nurse Call Pendant / Duress Button", "NVR", "Other", "Pager / Paging Transmitter", "Panel", "Telephony Component", "Translator", "Panic Button", "PC / Server", "PERS Fall Detection Pendant", "PERS Medical Unit", "Point to Point", "Power Supply / Transformer", "Rack / Patch Panel / Shelf", "Reader", "Relay", "Request to Exit", "Router", "Shop Supplies", "Software / License", "Smoke", "Strike / Door Hardware", "Thermostat"],
                'Alarm Type': ["Burglary", "Medical Panic", "Smoke/Heat/Fire", "Police Panic", "Low Temperature", "Carbon/Supervisory Alarm", "Water"],
                'Status': ["Installed", "Removed", "Pending", "Replaced", "Repaired"],
                'New/Existing': ["New", "Existing"],
                'Wired/Wireless': ["Wireless", "Wired"]
            },
            lessDynamicFields: {},
            dataSource: [
                {
                    key: '1',
                    productName: 'Mike',
                    sku: 32,
                    zone: '1',
                    status: 'Not Installed'
                },
            ],

            columns: [
                {
                    title: 'Product Name',
                    dataIndex: 'productName',
                    key: 'productName',
                    width: '20%'
                },
                {
                    title: 'SKU',
                    dataIndex: 'sku',
                    key: 'sku',
                    width: '20%'
                },
                {
                    title: 'Zone',
                    dataIndex: 'zone',
                    key: 'zone',
                    width: '20%'
                },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    width: '20%'
                },
                {
                    title: 'Action',
                    dataIndex: 'action',
                    key: 'action',
                    width: '10%'
                }
            ],
        }
    },
    methods: {
        openAddEquipmentModal(index) {
            this.openAddEquipment = true;
            this.currentSoldItem = this.workOrderData.soldItems[index];
            this.currentSoldItem['index'] = index;
            if(index === 0) {
                this.disablePreviousButton = true;
            } else {
                this.disablePreviousButton = false;
            }
            if(index === this.workOrderData.soldItems.length - 1) {
                this.disableNextButton = true;
            } else {
                this.disableNextButton = false;
            }
        },
        addItem() {
            this.workOrderData.quotesItems.push({
                id: Date.now(),
                systemType: undefined
            });
            console.log(this.workOrderData);
            this.mobileViewMode.showingAllItems[this.mobileViewMode.showingAllItems.length] = false;
            console.log(this.mobileViewMode.showingAllItems);
        },
        addItemMobile(currentIndex) {
            this.mobileViewMode.openAddItemModel = true;
            this.mobileViewMode.currentOpenedItem = currentIndex;
        },
        addNewItemMobile() {
            this.workOrderData.quotesItems.push(this.mobileViewMode.newQuotesItem);
            this.mobileViewMode.showingAllItems[this.mobileViewMode.showingAllItems.length] = false;
            this.mobileViewMode.openAddItemModel = false;
            this.mobileViewMode.newQuotesItem = {};
        },
        editQuotesItem(index) {
            this.mobileViewMode.isEditMode = true;
            this.mobileViewMode.openAddItemModel = true;
            this.mobileViewMode.newQuotesItem = this.workOrderData.quotesItems[index];
            this.mobileViewMode.newQuotesItem['item_id'] = index;
            this.mobileViewMode.oldData = { ...this.mobileViewMode.newQuotesItem };
        },
        updateNewItemMobile() {
            this.workOrderData.quotesItems[this.mobileViewMode.newQuotesItem.item_id] = this.mobileViewMode.newQuotesItem;
            this.mobileViewMode.isEditMode = false;
            this.mobileViewMode.openAddItemModel = false;
            this.mobileViewMode.newQuotesItem = {};
            this.mobileViewMode.oldData = {};
        },
        removeItem(item) {
            const index = this.workOrderData.quotesItems.indexOf(item);
            if (index !== -1) {
                this.workOrderData.quotesItems.splice(index, 1);
                this.mobileViewMode.showingAllItems.splice(index, 1);
            }
        },
        onLoadMore(index) {
            this.mobileViewMode.showingAllItems[index] = true;
            console.log(this.mobileViewMode.showingAllItems);
        },
        onLoadLess(index) {
            this.mobileViewMode.showingAllItems[index] = false;
            console.log(this.mobileViewMode.showingAllItems);
        },
        formatKey(key) {
            return key.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .trim();
        },
        camelCase(str) {
            return str
                .replace(/[^a-zA-Z0-9]/g, ' ')
                .trim()
                .toLowerCase()
                .split(' ')
                .filter(Boolean)
                .map((word, index) => {
                    if (index === 0) {
                        return word;
                    }
                    return word.charAt(0).toUpperCase() + word.slice(1);
                })
                .join('');
        },
        stringToPascalCase(str) {
            let hasSpecialChars = /[^a-zA-Z0-9 ]/.test(str);
            return hasSpecialChars ? str : str
                .toLowerCase()
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join("");
        },
        updateScreenWidth() {
            this.screenWidth = window.innerWidth;
            if (this.screenWidth <= 576) {
                this.mobileViewMode.mobileView = true;
            } else {
                this.mobileViewMode.mobileView = false;
            }
        },
        debounce(func, delay) {
            let timeout;
            return function (...args) {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), delay);
            };
        },
        handleAddItemCancel() {
            this.mobileViewMode.canceling = true;
            if (Object.keys(this.mobileViewMode.oldData).length !== 0) {
                this.workOrderData.quotesItems[this.mobileViewMode.oldData.item_id] = this.mobileViewMode.oldData;
            }
            setTimeout(() => {
                this.mobileViewMode.oldData = {};
                this.mobileViewMode.newQuotesItem = {};
                this.mobileViewMode.isEditMode = false;
                this.mobileViewMode.openAddItemModel = false;
                this.mobileViewMode.canceling = false;
            }, 500)
        },
        showPreviousItem() {
            this.workOrderData.soldItems[this.currentSoldItem.index] = this.currentSoldItem;
            console.log(this.workOrderData.soldItems);
            const previousItemIndex = this.currentSoldItem.index - 1;
            if(this.workOrderData.soldItems.length > 0) {
                this.currentSoldItem = this.workOrderData.soldItems[previousItemIndex];
                this.currentSoldItem['index'] = previousItemIndex;
                this.disablePreviousButton = false;
                this.disableNextButton = false;
                if(previousItemIndex === 0) {
                    this.disablePreviousButton = true;
                }
            }
        },
        showNextItem() {
            this.workOrderData.soldItems[this.currentSoldItem.index] = this.currentSoldItem;
            console.log(this.workOrderData.soldItems);
            const nextItemIndex = this.currentSoldItem.index + 1;
            if(this.workOrderData.soldItems.length > nextItemIndex) {
                this.disablePreviousButton = false;
                this.currentSoldItem = this.workOrderData.soldItems[nextItemIndex];
                this.currentSoldItem['index'] = nextItemIndex;
                this.disableNextButton = false;
                if(nextItemIndex === this.workOrderData.soldItems.length - 1) {
                    this.disableNextButton = true;
                }
            }
        },
        async installEquipment() {
            this.installingEquipment = true;
            const currSoldItem = this.currentSoldItem;
            const newInstalledEquipment = {
                Sold_Item: {
                    id: currSoldItem.recordId,
                    name: currSoldItem.productName
                },
                Account_Name: this.workOrderData.Account_Name.id,
                System_Name: this.workOrderData.Record_Id,
                Device_Type: currSoldItem.deviceType,
                Device_Status: currSoldItem.status,
                New_Existing: currSoldItem.newExisting,
                Wired_Wireless: currSoldItem.wiredWireless,
                Part_Number: currSoldItem.part,
                Location: currSoldItem.location,
                Zone: currSoldItem.zone,
                Technician: this.workOrderData.Technician_Name
            }
            if(currSoldItem.alarmType) {
                newInstalledEquipment['Alarm_Type'] = currSoldItem.alarmType;
            }
            currSoldItem['sku'] = currSoldItem.part.split(" - ")[0];
            console.log(currSoldItem);

            try {
                await axios.post('/server/work_order_function/api/crm/installedEquipments', newInstalledEquipment);
                this.workOrderData.installedEquipments.push(currSoldItem);
                this.workOrderData.soldItems.splice(currSoldItem.index, 1);
                console.log(this.workOrderData);

                message.success('Equipment Installed Successfully');
            } catch (error) {
                message.warning('Error Installing Equipment');
                console.log("Error installing equipment: ", error);
            }
            this.installingEquipment = false;
            this.openAddEquipment = false;
        }
    }
}
</script>

<style scoped>
.work-order-form-container {
    /* width: 95%; */
    height: 63vh;
    overflow: auto;
    background-color: white;
    border-radius: 10px;
    padding: 20px 30px;
    padding-bottom: 50px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}

.quotes-items-container {
    border: 1px solid #cbcbcb;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
    overflow: hidden;
}

.quotes-items-header {
    background-color: #434343;
    color: white;
    padding: 5px 20px;
    /* font-weight: bold; */
    font-size: 16px;
}

.sub-form-wrapper {
    overflow: hidden;
    margin-top: -10px;
    /* padding-top: 10px; */
    padding: 20px;
    margin-bottom: 20px;
}

.sub-form-wrapper .item-row:last-of-type {
    border-bottom: 0.1px solid rgb(198, 198, 198);
}

.item-main-details-container {
    padding: 5px;
    padding-top: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    background-color: #f4f4f4;
    transition: 0.2s;
}

.item-details-card {
    width: 90%;
    margin-bottom: 10px;
    margin-left: -10px;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
}

.item-row {
    display: flex;
    justify-content: space-between;
    position: relative;
    /* margin-bottom: 8px; */
    width: 100%;
    /* overflow-x: auto; */
    padding: 10px 20px;
}

.delete-action-container {
    /* background-color: white; */
    position: absolute;
    z-index: 99;
    top: 0;
    right: 0;
    height: 100%;
    padding: 0px 20px;
}

.delete-action-icon {
    margin-top: 45px;
    color: #ea3a34;
    font-size: 18px;
}

.delete-action-icon:hover {
    color: #e90e07;
}

.item-row:nth-child(even) {
    background-color: #f2f9fe;
    background-color: #f5f5f5;
}

#sub-form-add-button-container {
    padding: 0px 20px;
    padding-top: 10px;
}

#sub-form-add-button {
    background-color: #ea3a34;
    color: whitesmoke;
    border: none;
    padding: 0px 12px;
    font-weight: 650;
    margin-top: 10px;
    /* width: 100%; */
    border-radius: 5px;
}

#sub-form-add-button:hover {
    background-color: #ed1a13;
}

.dynamic-fields-container {
    width: auto;
    margin-left: -5px;
}

.ant-steps-item-icon {
    background-color: #d52b1e !important;
}

.sold-items-table tr {
    margin-bottom: -50px;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
    width: 4px;
    /* Width of the scrollbar */
    height: 4px;
    /* Height for horizontal scrollbar */
}

/* Track (background of the scrollbar) */
/* ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
} */

/* Thumb (draggable part of the scrollbar) */
::-webkit-scrollbar-thumb {
    background-color: #888;
    /* Dark grey color */
    border-radius: 10px;
    /* Rounded corners on the thumb */
}

/* Thumb hover (changes when hovered) */
::-webkit-scrollbar-thumb:hover {
    background-color: #555;
    /* Darker grey when hovered */
}

@media only screen and (max-width: 576px) {
    .work-order-form-container {
        padding: 18px;
        height: 73vh;
    }

}
</style>