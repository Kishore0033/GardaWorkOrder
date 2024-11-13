import * as ZOHOCRMSDK from "@zohocrm/nodejs-sdk-5.0"
import { initialCrmSdk } from "../middleware/CRMSDK.js";

const initializer = async () => {
    try {
        await initialCrmSdk();
        // console.log("CRM NODEJS SDK INITIALIZED SUCCESSFULLY");
    } catch (error) {
        console.log("Error Initializing CRM NODEJS SDK");
        throw new Error("Error Initializing CRM NODEJS SDK: " + e)
    }
}

export const searchRecords = async (dealId) => {
    try {
        if (dealId.charAt(0) === 'd') {
            const getDealDetails = await searchDealData(dealId);
            if(getDealDetails.status && getDealDetails.status === 404) {
                // console.log("GetValues: ", getDealDetails);
                throw new Error("System Not Found");
            }
            const getSoldItemsResp = await getSoldItems(BigInt(getDealDetails.record_id));
            const getInstalledEquipmentsResp = await getInstalledEquipments(BigInt(getDealDetails.record_id));

            return {
                type_of_work: 'New Installation',
                ...getDealDetails,
                sold_items: getSoldItemsResp,
                installed_equipments: getInstalledEquipmentsResp
            };
        } else {
            const getDealDetailsFromSC = await searchDealFromSC(dealId);
            if(getDealDetailsFromSC.status && getDealDetailsFromSC.status === 404) {
                throw new Error("Service Call Not Found");
            }
            const getDealId = getDealDetailsFromSC.Deal_Id;
            const getDealDetails = await getDealById(getDealId);
            if(getDealDetails.status && getDealDetails.status === 404) {
                throw new Error("System Not Found");
            }

            const getSoldItemsResp = await getSoldItems(BigInt(getDealDetails.record_id));
            const getInstalledEquipmentsResp = await getInstalledEquipments(BigInt(getDealDetails.record_id));

            return {
                type_of_work: 'Service Call',
                ...getDealDetails,
                sold_items: getSoldItemsResp,
                installed_equipments: getInstalledEquipmentsResp
            };
        }
    } catch (error) {
        console.log("Error: ", error);
        throw new Error(error);
    }
}

const searchDealData = async (dealId) => {
    try {
        await initializer();
        let moduleAPIName = "Potentials";
        let recordOperations = new ZOHOCRMSDK.Record.RecordOperations();
        let paramInstance = new ZOHOCRMSDK.ParameterMap();

        await paramInstance.add(ZOHOCRMSDK.Record.SearchRecordsParam.CRITERIA, `(Deal_ID:equals:${dealId})`);
        let headerInstance = new ZOHOCRMSDK.HeaderMap();

        let response = await recordOperations.searchRecords(moduleAPIName, paramInstance, headerInstance);

        if (response != null) {
            // console.log("Status Code: " + response.getStatusCode());
            if ([204, 304].includes(response.getStatusCode())) {
                // console.log(response.getStatusCode() == 204 ? "No Content" : "Not Modified");
                return { status: response.getStatusCode(), message: 'Record not found' };
            }
            let responseObject = response.getObject();
            if (responseObject != null) {
                if (responseObject instanceof ZOHOCRMSDK.Record.ResponseWrapper) {
                    let records = responseObject.getData();
                    let getValues = {};
                    records.forEach(record => {
                        const getKeyVal = record.getKeyValues();
                        getValues['record_id'] = record.getId().toString();
                        // console.log("Searched Records: " + getKeyVal);
                        // console.log("Record ID: " + record.getId());

                        for (const [key, value] of getKeyVal) {
                            // console.log(key);

                            if (key === 'Account_Name') {
                                getValues[key] = {
                                    id: value.keyValues.get('id').toString(),
                                    name: value.keyValues.get('name')
                                }
                            } if (key === 'Site_System_Types') {
                                getValues[key] = value;
                            }
                            if (key === 'Contact_Name') {
                                getValues[key] = value.keyValues.get('name');
                            }
                            if (key === 'Contact_Phone') {
                                getValues[key] = value;
                            } if (key === 'Site_Street') {
                                getValues[key] = value;
                            } if (key === 'Site_City') {
                                getValues[key] = value;
                            } if (key === 'Site_Province') {
                                getValues[key] = value;
                            } if (key === 'Site_Postal_Code') {
                                getValues[key] = value;
                            } if (key === 'Technician_Name') {
                                if(value) {
                                    getValues[key] = {
                                        id: value.keyValues.get('id').toString(),
                                        name: value.keyValues.get('name')
                                    }
                                }
                            }
                        }
                    })
                    return getValues;
                }
            }
        }
    } catch (error) {
        console.log("Error in searchDealData(): " + error);
        throw new Error("Error searching deals: " + error)
    }
}

const searchDealFromSC = async (serviceCallId) => {
    try {
        await initializer();
        let moduleAPIName = "Service_Calls";
        let recordOperations = new ZOHOCRMSDK.Record.RecordOperations();
        let paramInstance = new ZOHOCRMSDK.ParameterMap();

        await paramInstance.add(ZOHOCRMSDK.Record.SearchRecordsParam.CRITERIA, `(Service_Call:equals:${serviceCallId})`);
        let headerInstance = new ZOHOCRMSDK.HeaderMap();

        let response = await recordOperations.searchRecords(moduleAPIName, paramInstance, headerInstance);

        if (response != null) {
            // console.log("Status Code: " + response.getStatusCode());
            if ([204, 304].includes(response.getStatusCode())) {
                // console.log(response.getStatusCode() == 204 ? "No Content" : "Not Modified");
                return { status: response.getStatusCode(), message: 'Record not found' };
            }
            let responseObject = response.getObject();
            if (responseObject != null) {
                if (responseObject instanceof ZOHOCRMSDK.Record.ResponseWrapper) {
                    let records = responseObject.getData();
                    let getValues = {};
                    records.forEach(record => {
                        const getKeyVal = record.getKeyValues();
                        getValues['record_id'] = record.getId().toString();
                        // console.log("Searched Records: " + getKeyVal);
                        // console.log("Record ID: " + record.getId());

                        for (const [key, value] of getKeyVal) {
                            if (key === 'Deal_Name') {
                                getValues['Deal_Id'] = value.keyValues.get('id').toString();
                            }
                        }
                    })
                    return getValues;
                }
            }
        }
    } catch (error) {
        throw new Error("Error searching service call: " + error)
    }
}

const getDealById = async (recordId) => {
    try {
        await initializer();
        let moduleAPIName = "Potentials";
        // let recordId = recordId;
        let recordOperations = new ZOHOCRMSDK.Record.RecordOperations();
        let paramInstance = new ZOHOCRMSDK.ParameterMap();

        let fieldsArray = ["id", "Company", "Account_Name", "Site_System_Types", "Contact_Name", "Contact_Phone", "Site_Street", "Site_City", "Site_Province", "Site_Postal_Code", "Technician_Name"];
        await paramInstance.add(ZOHOCRMSDK.Record.GetRecordParam.FIELDS, fieldsArray.toString());

        let headerInstance = new ZOHOCRMSDK.HeaderMap();

        let response = await recordOperations.getRecord(BigInt(recordId), moduleAPIName, paramInstance, headerInstance);
        if (response != null) {
            // console.log("Status Code: " + response.getStatusCode());
            if ([204, 304].includes(response.getStatusCode())) {
                // console.log(response.getStatusCode() == 204 ? "No Content" : "Not Modified");
                return { status: response.getStatusCode(), message: "Record not found" };
            }
            let responseObject = response.getObject();
            if (responseObject != null) {
                if (responseObject instanceof ZOHOCRMSDK.Record.ResponseWrapper) {
                    let records = responseObject.getData();
                    let getValues = {}
                    records.forEach(record => {
                        getValues['record_id'] = record.getId().toString();
                        // console.log("Record ID: " + record.getId());

                        let keyValues = record.getKeyValues();
                        for (const [key, value] of keyValues) {
                            if (key === 'Account_Name') {
                                getValues[key] = {
                                    id: value.keyValues.get('id').toString(),
                                    name: value.keyValues.get('name')
                                }
                            }
                            if(key === 'Contact_Name') {
                                getValues[key] = value.keyValues.get('name');
                            }
                            if(key === 'Site_System_Types' ) {
                                getValues[key] = value;
                            }
                            if(key === 'Contact_Phone') {
                                getValues[key] = value;
                            }
                            if(key === 'Site_Street') {
                                getValues[key] = value;
                            }
                            if(key === 'Site_City') {
                                getValues[key] = value;
                            }
                            if(key === 'Site_Province') {
                                getValues[key] = value;
                            }
                            if(key === 'Site_Postal_Code') {
                                getValues[key] = value;
                            }
                            if(key === 'Technician_Name') {
                                getValues[key] = {
                                    id: value.keyValues.get('id').toString(),
                                    name: value.keyValues.get('name')
                                }
                            }
                        }
                    });
                    return getValues;
                }
            }
        }
    } catch (error) {
        console.log("Error: ", error);
        throw new Error('Error getting record: ' + error)
    }
}

const getSoldItems = async (dealId) => {
    try {
        await initializer();
        let moduleAPIName = "Equipment";
        let recordOperations = new ZOHOCRMSDK.Record.RecordOperations();
        let paramInstance = new ZOHOCRMSDK.ParameterMap();

        await paramInstance.add(ZOHOCRMSDK.Record.SearchRecordsParam.CRITERIA, `(Deal:equals:${dealId})`);
        let headerInstance = new ZOHOCRMSDK.HeaderMap();

        let response = await recordOperations.searchRecords(moduleAPIName, paramInstance, headerInstance);

        if (response != null) {
            // console.log("Status Code: " + response.getStatusCode());
            if ([204, 304].includes(response.getStatusCode())) {
                // console.log(response.getStatusCode() == 204 ? "No Content" : "Not Modified");
                return { status: response.getStatusCode(), message: 'Record not found' };
            }
            let responseObject = response.getObject();
            if (responseObject != null) {
                if (responseObject instanceof ZOHOCRMSDK.Record.ResponseWrapper) {
                    let records = responseObject.getData();
                    let allInstallEquipments = [];
                    // console.log("All Installed Equipments: ", records.length);
                    // console.log();
                    const requiredFields = ['Item_Name', 'Installation_Status'];

                    records.forEach(async record => {
                        let getValues = {};
                        getValues['record_id'] = record.getId().toString();
                        const getKeyVal = record.getKeyValues();
                        // console.log("Searched Records: " + getKeyVal);
                        // console.log("Record ID: " + record.getId());

                        for (const [key, value] of getKeyVal) {
                            if(requiredFields.includes(key)) {
                                // if(key === 'Account_Name') {
                                //     console.log("Account: ", value.keyValues);
                                //     console.log("Type: ", typeof value.keyValues);
                                //     const accountObj = Object.fromEntries(value.keyValues);
                                //     console.log(accountObj.name);
                                //     getValues[key] = { name: accountObj.name };
                                //     console.log();
                                if(key === "Device_Status") {
                                    getValues['status'] = value;
                                } else if(key === "Part_Number") {
                                    getValues['part'] = value;
                                } else if(key === "Item_Name") {
                                    getValues['Product_Name'] = value;
                                } else {
                                    getValues[key] = value;
                                }
                            }
                        }
                        allInstallEquipments.push(await normalizeQuotesItem(getValues));
                    })
                    return allInstallEquipments;
                }
            }
        }
    } catch (error) {
        throw new Error("Error searching deals: " + error)
    }
}

const getSoldItemsById = async (recordId) => {
    try {
        await initializer();
        let moduleAPIName = "Equipment";
        let recordOperations = new ZOHOCRMSDK.Record.RecordOperations();
        let paramInstance = new ZOHOCRMSDK.ParameterMap();
        let headerInstance = new ZOHOCRMSDK.HeaderMap();
        let response = await recordOperations.getRecord(recordId, moduleAPIName, paramInstance, headerInstance);
        if (response != null) {
            // console.log("Status Code: " + response.getStatusCode());
            if ([204, 304].includes(response.getStatusCode())) {
                return { status: response.getStatusCode(), message: 'Record not found' };
            }
            let responseObject = response.getObject();
            if (responseObject != null) {
                if (responseObject instanceof ZOHOCRMSDK.Record.ResponseWrapper) {
                    let records = responseObject.getData();
                    let getValues = {};
                    records.forEach(record => {
                        getValues['record_id'] = record.getId().toString();
                        const getKeyVal = record.getKeyValues();

                        const requiredFields = ["Item_Name", "Item_SKU"]
                        for (const [key, value] of getKeyVal) {
                            if(requiredFields.includes(key)) {
                                if(key === "Item_Name") {
                                    getValues['Product_Name'] = value;
                                } if(key === "Item_SKU") {
                                    getValues['SKU'] = value;
                                }
                            }
                        }
                    });
                    return getValues;
                }
            }
        }
    } catch (error) {
        throw new Error("Error getting sold item by id" + error);
    }
}

const getInstalledEquipments = async (dealId) => {
    try {
        await initializer();
        let moduleAPIName = "Installed_Equipment";
        let recordOperations = new ZOHOCRMSDK.Record.RecordOperations();
        let paramInstance = new ZOHOCRMSDK.ParameterMap();

        await paramInstance.add(ZOHOCRMSDK.Record.SearchRecordsParam.CRITERIA, `(Deal:equals:${dealId})`);
        let headerInstance = new ZOHOCRMSDK.HeaderMap();

        let response = await recordOperations.searchRecords(moduleAPIName, paramInstance, headerInstance);

        if (response != null) {
            if ([204, 304].includes(response.getStatusCode())) {
                return { status: response.getStatusCode(), message: 'Record not found' };
            }

            let responseObject = response.getObject();
            if (responseObject != null) {
                if (responseObject instanceof ZOHOCRMSDK.Record.ResponseWrapper) {
                    let records = responseObject.getData();
                    let allInstallEquipments = [];
                    const requiredFields = ['Zone', 'Device_Type', 'Alarm_Type', 'Device_Status', 'Location', 'Part_Number', 'New_Existing', 'Wired_Wireless', 'Device_Serviced', 'Sold_Item'];

                    for (const record of records) {
                        let getValues = {};
                        getValues['record_id'] = record.getId().toString();
                        const getKeyVal = record.getKeyValues();

                        for (const [key, value] of getKeyVal) {
                            if (requiredFields.includes(key)) {
                                if (key === "Device_Status") {
                                    getValues['status'] = value;
                                } else if (key === "Part_Number") {
                                    getValues['part'] = value;
                                    getValues['SKU'] = value.split(" - ")[0];
                                } else if (key === 'Device_Serviced') {
                                    getValues['serviced'] = value === "true" ? "Yes" : "No";
                                } else if (key === 'Sold_Item') {
                                    if (value) {
                                        // console.log(value.keyValues.get("id"));
                                        const getSoldItem = await getSoldItemsById(BigInt(value.keyValues.get("id")));
                                        // console.log(getSoldItem);
                                        getValues['Product_Name'] = getSoldItem.Product_Name;
                                        // getValues['SKU'] = getSoldItem.SKU;
                                    }
                                } else {
                                    getValues[key] = value;
                                }
                            }
                        }

                        allInstallEquipments.push(await normalizeQuotesItem(getValues));
                    }
                    return allInstallEquipments;
                }
            }
        }
    } catch (error) {
        throw new Error("Error searching deals: " + error);
    }
};

let allTechnicians = [];

export const getAllTechnicians = async () => {
    try {
        let page = 1;
        await getTechnicians(page);
        return allTechnicians;
    } catch (error) {
        throw new Error('Error getting technicians: ' + error);
    }
}

const getTechnicians = async (page) => {
    try {
        await initializer();
    } catch (error) {
        throw new Error('Error Initializing CRM SDK: ' + error);
    }

    try {
        let moduleAPIName = "Technicians";
        let recordOperations = new ZOHOCRMSDK.Record.RecordOperations();
        let paramInstance = new ZOHOCRMSDK.ParameterMap();
        let fieldNames = ["Name"];
        await paramInstance.add(ZOHOCRMSDK.Record.GetRecordsParam.FIELDS, fieldNames.toString());

        await paramInstance.add(ZOHOCRMSDK.Record.GetRecordsParam.PAGE, page);
        await paramInstance.add(ZOHOCRMSDK.Record.GetRecordsParam.PER_PAGE, 200);

        let headerInstance = new ZOHOCRMSDK.HeaderMap();

        let response = await recordOperations.getRecords(moduleAPIName, paramInstance, headerInstance);

        if (response != null) {
            // console.log("Status Code: " + response.getStatusCode());
            if ([204, 304].includes(response.getStatusCode())) {
                console.log(response.getStatusCode() == 204 ? "No Content" : "Not Modified");
                return;
            }
            let responseObject = response.getObject();
            if (responseObject != null) {
                if (responseObject instanceof ZOHOCRMSDK.Record.ResponseWrapper) {
                    let records = responseObject.getData();
                    records.forEach(record => {
                        let newTechnician = {};
                        newTechnician['recordId'] = record.getId().toString()
                        let keyValues = record.getKeyValues();
                        let keyArray = Array.from(keyValues.keys());
                        keyArray.forEach(keyName => {
                            let value = keyValues.get(keyName);
                            if (value != null) {
                                if(keyName === "Name") {
                                    newTechnician['Technician_Name'] = value;
                                }
                            }
                        });
                        allTechnicians.push(newTechnician);
                });
                let info = responseObject.getInfo();

                if(info.getMoreRecords()) {
                    let nextPage = page + 1;
                    await getTechnicians(nextPage)
                }

                }
                else if (responseObject instanceof ZOHOCRMSDK.Record.APIException) {
                    // console.log("Status: " + responseObject.getStatus().getValue());
                    // console.log("Code: " + responseObject.getCode().getValue());
                    // console.log("Details");
                    let details = responseObject.getDetails();
                    if (details != null) {
                        Array.from(details.keys()).forEach(key => {
                            // console.log(key + ": " + details.get(key));
                        });
                    }
                    // console.log("Message: " + responseObject.getMessage().getValue());
                    throw new Error("API Exception: " + responseObject.getMessage().getValue());
                }
            }
        }
    } catch (error) {
        throw new Error('Error getting technicians: ' + error);
    }
}

const normalizeQuotesItem = async (item) => {
    const newItem = {};
    for(const key in item) {
        if(item[key] && typeof item[key] === 'object' && 'value' in item[key]) {
            newItem[key] = item[key].value;
        } else {
            newItem[key] = item[key];
        }
    }
    return newItem;
}

export const getRecords = async () => {
    //example
    try {
        await initializer();
        console.log("SDK initialized successfully");
    } catch (e) {
        console.log("Failed to initialize sdk");
    }
    try {
        let moduleAPIName = "Quotes";
        //example
        //let moduleAPIName = "module_api_name";
        let recordId = 2148988000585870306n;
        let recordOperations = new ZOHOCRMSDK.Record.RecordOperations();
        let paramInstance = new ZOHOCRMSDK.ParameterMap();
        /* Possible parameters for Get Record operation*/
        // await paramInstance.add(ZOHOCRMSDK.Record.GetRecordParam.APPROVED, "true");
        // await paramInstance.add(ZOHOCRMSDK.Record.GetRecordParam.CONVERTED, "false");
        // await paramInstance.add(ZOHOCRMSDK.Record.GetRecordParam.CVID, "34096430087501");
        let fieldsArray = ["id", "Business_Name"];
        await paramInstance.add(ZOHOCRMSDK.Record.GetRecordParam.FIELDS, fieldsArray.toString());
        /* Month is zero-indexed.
        0 . January ..... 11 . December
        */
        // let startDateTime = new Date(2020, 7, 10, 10, 10, 10);
        // await paramInstance.add(ZOHOCRMSDK.Record.GetRecordParam.STARTDATETIME, startDateTime);
        // let endDateTime = new Date(2020, 7, 10, 12, 12, 12);
        // await paramInstance.add(ZOHOCRMSDK.Record.GetRecordParam.ENDDATETIME, endDateTime);
        // await paramInstance.add(ZOHOCRMSDK.Record.GetRecordParam.TERRITORY_ID, "34096430505351");
        // await paramInstance.add(ZOHOCRMSDK.Record.GetRecordParam.INCLUDE_CHILD, "true");
        // await paramInstance.add(ZOHOCRMSDK.Record.GetRecordParam.UID, "34096430500741");
        let headerInstance = new ZOHOCRMSDK.HeaderMap();
        /* Possible headers for Get Record operation*/
        await headerInstance.add(ZOHOCRMSDK.Record.GetRecordHeader.IF_MODIFIED_SINCE, new Date("2020-01-01T01:01:01+05:30"));
        // headerInstance.add(GetRecordHeader.X_EXTERNAL, "Leads.External");
        //Call getRecord method that takes recordId, moduleAPIName, paramInstance and headerInstance as parameter
        let response = await recordOperations.getRecord(recordId, moduleAPIName, paramInstance, headerInstance);
        if (response != null) {
            console.log("Status Code: " + response.getStatusCode());
            if ([204, 304].includes(response.getStatusCode())) {
                console.log(response.getStatusCode() == 204 ? "No Content" : "Not Modified");
                return;
            }
            let responseObject = response.getObject();
            if (responseObject != null) {

                if (responseObject instanceof ZOHOCRMSDK.Record.ResponseWrapper) {
                    let records = responseObject.getData();
                    console.log("Resposne Object: ", records);
                    records.forEach(record => {
                        console.log("Record ID: " + record.getId());
                        let createdBy = record.getCreatedBy();
                        if (createdBy != null) {
                            console.log("Record Created By User-ID: " + createdBy.getId());
                            console.log("Record Created By User-Name: " + createdBy.getName());
                            console.log("Record Created By User-Email: " + createdBy.getEmail());
                        }
                        console.log("Record CreatedTime: " + record.getCreatedTime());
                        let modifiedBy = record.getModifiedBy();
                        if (modifiedBy != null) {
                            console.log("Record Modified By User-ID: " + modifiedBy.getId());
                            console.log("Record Modified By User-Name: " + modifiedBy.getName());
                            console.log("Record Modified By User-Email: " + modifiedBy.getEmail());
                        }
                        console.log("Record ModifiedTime: " + record.getModifiedTime());
                        let tags = record.getTag();
                        if (tags != null) {
                            tags.forEach(tag => {
                                console.log("Record Tag Name: " + tag.getName());
                                console.log("Record Tag ID: " + tag.getId());
                            });
                        }
                        //To get particular field value
                        console.log("Record Field Value: " + record.getKeyValue("Last_Name"));// FieldApiName
                        console.log("Record KeyValues: ");
                        let keyValues = record.getKeyValues();
                        let keyArray = Array.from(keyValues.keys());
                        keyArray.forEach(keyName => {
                            let value = keyValues.get(keyName);
                            if (value != null) {
                                if (Array.isArray(value)) {
                                    if (value.length > 0) {
                                        if (value[0] instanceof ZOHOCRMSDK.Record.FileDetails) {
                                            let fileDetails = value;
                                            fileDetails.forEach(fileDetail => {
                                                console.log("Record FileDetails FileIds: " + fileDetail.getFileIdS());
                                                console.log("Record FileDetails FileNameS: " + fileDetail.getFileNameS());
                                                console.log("Record FileDetails SizeS: " + fileDetail.getSizeS());
                                                console.log("Record FileDetails Id: " + fileDetail.getId());
                                            });
                                        } else if (value[0] instanceof ZOHOCRMSDK.Choice) {
                                            let choiceArray = value;
                                            console.log(keyName);
                                            console.log("Values");
                                            choiceArray.forEach(eachChoice => {
                                                console.log(eachChoice.getValue());
                                            });
                                        } else if (value[0] instanceof ZOHOCRMSDK.Tags.Tag) {
                                            let tags1 = value;
                                            tags1.forEach(tag => {
                                                console.log("Record Tag Name: " + tag.getName());
                                                console.log("Record Tag ID: " + tag.getId());
                                            });
                                        } else if (value[0] instanceof ZOHOCRMSDK.Record.PricingDetails) {
                                            let pricingDetails = value;
                                            pricingDetails.forEach(pricingDetail => {
                                                console.log("Record PricingDetails ToRange: " + pricingDetail.getToRange().toString());
                                                console.log("Record PricingDetails Discount: " + pricingDetail.getDiscount().toString());
                                                console.log("Record PricingDetails ID: " + pricingDetail.getId());
                                                console.log("Record PricingDetails FromRange: " + pricingDetail.getFromRange().toString());
                                            });
                                        } else if (value[0] instanceof ZOHOCRMSDK.Record.Participants) {
                                            let participants = value;
                                            participants.forEach(participant => {
                                                console.log("Record Participants Name: " + participant.getName());
                                                console.log("Record Participants Invited: " + participant.getInvited().toString());
                                                console.log("Record Participants ID: " + participant.getId());
                                                console.log("Record Participants Type: " + participant.getType());
                                                console.log("Record Participants Participant: " + participant.getParticipant());
                                                console.log("Record Participants Status: " + participant.getStatus());
                                            });
                                        } else if (value[0] instanceof ZOHOCRMSDK.Record.Record) {
                                            let recordArray = value;
                                            recordArray.forEach(record1 => {
                                                Array.from(record1.getKeyValues().keys()).forEach(key => {
                                                    console.log(key + ": " + JSON.stringify(record1.getKeyValues().get(key), (_, v) => typeof v === 'bigint' ? `${v}n` : v).replace(/"(-?\d+)n"/g, (_, a) => a));
                                                });
                                            });
                                        } else if (value[0] instanceof ZOHOCRMSDK.Record.LineTax) {
                                            let lineTaxes = value;
                                            lineTaxes.forEach(lineTax => {
                                                console.log("Record ProductDetails LineTax Percentage: " + lineTax.getPercentage().toString());
                                                console.log("Record ProductDetails LineTax Name: " + lineTax.getName());
                                                console.log("Record ProductDetails LineTax Id: " + lineTax.getId());
                                                console.log("Record ProductDetails LineTax Value: " + lineTax.getValue().toString());
                                            });
                                        } else if (value[0] instanceof ZOHOCRMSDK.Record.Comment) {
                                            let comments = value;
                                            comments.forEach(comment => {
                                                console.log("Record Comment CommentedBy: " + comment.getCommentedBy());
                                                console.log("Record Comment CommentedTime: " + comment.getCommentedTime().toString());
                                                console.log("Record Comment CommentContent: " + comment.getCommentContent());
                                                console.log("Record Comment Id: " + comment.getId());
                                            });
                                        } else if (value[0] instanceof ZOHOCRMSDK.Attachments.Attachment) {
                                            let attachments = value;
                                            attachments.forEach(attachment => {
                                                console.log("Record Attachment ID: " + attachment.getId());
                                                let owner = attachment.getOwner();
                                                if (owner != null) {
                                                    console.log("Record Attachment Owner - Name: " + owner.getName());
                                                    console.log("Record Attachment Owner ID: " + owner.getId());
                                                    console.log("Record Attachment Owner Email: " + owner.getEmail());
                                                }
                                                console.log("Record Attachment Modified Time: " + attachment.getModifiedTime().toString());
                                                console.log("Record Attachment File Name: " + attachment.getFileName());
                                                console.log("Record Attachment Created Time: " + attachment.getCreatedTime());
                                                console.log("Record Attachment File Size: " + attachment.getSize());
                                                let parentId = attachment.getParentId();
                                                if (parentId != null) {
                                                    console.log("Record Attachment parent record Name: " + parentId.getKeyValue("name"));
                                                    console.log("Record Attachment parent record ID: " + parentId.getId());
                                                }
                                                console.log("Record Attachment is Editable: " + attachment.getEditable().toString());
                                                console.log("Record Attachment File ID: " + attachment.getFileId());
                                                console.log("Record Attachment File Type: " + attachment.getType());
                                                console.log("Record Attachment seModule: " + attachment.getSeModule());
                                                let modifiedBy1 = attachment.getModifiedBy();
                                                if (modifiedBy1 != null) {
                                                    console.log("Record Attachment Modified By User-Name: " + modifiedBy1.getName());
                                                    console.log("Record Attachment Modified By User-ID: " + modifiedBy1.getId());
                                                    console.log("Record Attachment Modified By User-Email: " + modifiedBy1.getEmail());
                                                }
                                                console.log("Record Attachment State: " + attachment.getState());
                                                let createdBy1 = attachment.getCreatedBy();
                                                if (createdBy1 != null) {
                                                    console.log("Record Attachment Created By User-Name: " + createdBy1.getName());
                                                    console.log("Record Attachment Created By User-ID: " + createdBy1.getId());
                                                    console.log("Record Attachment Created By User-Email: " + createdBy1.getEmail());
                                                }
                                                console.log("Record Attachment LinkUrl: " + attachment.getLinkUrl());
                                            });
                                        } else if (value[0] instanceof ZOHOCRMSDK.Record.ImageUpload) {
                                            let imageUploads = value;
                                            imageUploads.forEach(imageUpload => {
                                                console.log("Record " + keyName + " Description: " + imageUpload.getDescriptionS());
                                                console.log("Record " + keyName + " File_Name: " + imageUpload.getFileNameS());
                                                console.log("Record " + keyName + " State: " + imageUpload.getStateS());
                                                console.log("Record " + keyName + " Size: " + imageUpload.getSizeS());
                                                console.log("Record " + keyName + " SequenceNumber: " + imageUpload.getSequenceNumberS());
                                                console.log("Record " + keyName + " Id: " + imageUpload.getId());
                                                console.log("Record " + keyName + " FileId: " + imageUpload.getFileIdS());
                                            });
                                        } else if (value[0] instanceof ZOHOCRMSDK.Record.Reminder) {
                                            let reminders = value;
                                            reminders.forEach(reminder => {
                                                console.log("Reminder Period: " + reminder.getPeriod());
                                                console.log("Reminder Unit: " + reminder.getUnit());
                                            });
                                        } else {
                                            console.log(keyName + ": " + value);
                                        }
                                    }
                                } else if (value instanceof ZOHOCRMSDK.Users.Users) {
                                    console.log("Record " + keyName + " User-ID: " + value.getId());
                                    console.log("Record " + keyName + " User-Name: " + value.getName());
                                    console.log("Record " + keyName + " User-Email: " + value.getEmail());
                                } else if (value instanceof ZOHOCRMSDK.Layouts.Layouts) {
                                    console.log(keyName + " ID: " + value.getId());
                                    console.log(keyName + " Name: " + value.getName());
                                } else if (value instanceof ZOHOCRMSDK.Record.Record) {
                                    console.log(keyName + " Record ID: " + value.getId());
                                    console.log(keyName + " Record Name: " + value.getKeyValue("name"));
                                } else if (value instanceof ZOHOCRMSDK.Choice) {
                                    console.log(keyName + ": " + value.getValue());
                                } else if (value instanceof ZOHOCRMSDK.Record.RemindAt) {
                                    console.log(keyName + ": " + value.getAlarm());
                                } else if (value instanceof ZOHOCRMSDK.Record.RecurringActivity) {
                                    console.log(keyName);
                                    console.log("RRULE: " + value.getRrule());
                                } else if (value instanceof ZOHOCRMSDK.Record.Consent) {
                                    console.log("Record Consent ID: " + value.getId());
                                    let owner = value.getOwner();
                                    if (owner != null) {
                                        console.log("Record Consent Owner Name: " + owner.getName());
                                        console.log("Record Consent Owner ID: " + owner.getId());
                                        console.log("Record Consent Owner Email: " + owner.getEmail());
                                    }
                                    let consentCreatedBy = value.getCreatedBy();
                                    if (consentCreatedBy != null) {
                                        console.log("Record Consent CreatedBy Name: " + consentCreatedBy.getName());
                                        console.log("Record Consent CreatedBy ID: " + consentCreatedBy.getId());
                                        console.log("Record Consent CreatedBy Email: " + consentCreatedBy.getEmail());
                                    }
                                    let consentModifiedBy = value.getModifiedBy();
                                    if (consentModifiedBy != null) {
                                        console.log("Record Consent ModifiedBy Name: " + consentModifiedBy.getName());
                                        console.log("Record Consent ModifiedBy ID: " + consentModifiedBy.getId());
                                        console.log("Record Consent ModifiedBy Email: " + consentModifiedBy.getEmail());
                                    }
                                    console.log("Record Consent CreatedTime: " + value.getCreatedTime());
                                    console.log("Record Consent ModifiedTime: " + value.getModifiedTime());
                                    console.log("Record Consent ContactThroughEmail: " + value.getContactThroughEmail());
                                    console.log("Record Consent ContactThroughSocial: " + value.getContactThroughSocial());
                                    console.log("Record Consent ContactThroughSurvey: " + value.getContactThroughSurvey());
                                    console.log("Record Consent ContactThroughPhone: " + value.getContactThroughPhone());
                                    console.log("Record Consent MailSentTime: " + value.getMailSentTime().toString());
                                    console.log("Record Consent ConsentDate: " + value.getConsentDate().toString());
                                    console.log("Record Consent ConsentRemarks: " + value.getConsentRemarks());
                                    console.log("Record Consent ConsentThrough: " + value.getConsentThrough());
                                    console.log("Record Consent DataProcessingBasis: " + value.getDataProcessingBasis());
                                    //To get custom values
                                    console.log("Record Consent Lawful Reason: " + value.getKeyValue("Lawful_Reason"));
                                } else if (value instanceof Map) {
                                    console.log(keyName);
                                    Array.from(value.keys()).forEach(key => {
                                        console.log(key + ": " + value.get(key));
                                    });
                                } else {
                                    console.log(keyName + ": " + value);
                                }
                            }
                        });
                    });
                }
                else if (responseObject instanceof ZOHOCRMSDK.Record.FileBodyWrapper) {
                    let streamWrapper = responseObject.getFile();
                    //Construct the file name by joining the destinationFolder and the name from StreamWrapper instance
                    let fileName = path.join(destinationFolder, streamWrapper.getName());
                    let readStream = streamWrapper.getStream();
                    //Write the stream to the destination file.
                    fs.writeFileSync(fileName, readStream);
                }
                else if (responseObject instanceof ZOHOCRMSDK.Record.APIException) {
                    console.log("Status: " + responseObject.getStatus().getValue());
                    console.log("Code: " + responseObject.getCode().getValue());
                    console.log("Details");
                    let details = responseObject.getDetails();
                    if (details != null) {
                        Array.from(details.keys()).forEach(key => {
                            console.log(key + ": " + details.get(key));
                        });
                    }
                    console.log("Message: " + responseObject.getMessage().getValue());
                }
            }
        }
        console.log("Try Block Completed");

    } catch (error) {
        console.log("Errorrrrr: ", error);
        throw new Error("Error" + error)
    }
}

const updateSoldItem = async (soldItemId) => {
    try {
        await initializer();
    } catch (error) {
        throw new Error("Error Initializing CRM SDK: " + error);
    }
    try {
        let moduleAPIName = "Equipment";
        let recordId = BigInt(soldItemId);
        let recordOperations = new ZOHOCRMSDK.Record.RecordOperations();
        let request = new ZOHOCRMSDK.Record.BodyWrapper();
        let recordsArray = [];
        let record = new ZOHOCRMSDK.Record.Record();

        record.addKeyValue("Installation_Status", new ZOHOCRMSDK.Choice("All Items Installed"));
        recordsArray.push(record);
        request.setData(recordsArray);

        let headerInstance = new ZOHOCRMSDK.HeaderMap();

        let response = await recordOperations.updateRecord(recordId, moduleAPIName, request, headerInstance);
        if (response != null) {
            let responseObject = response.getObject();
            if (responseObject != null) {
                if (responseObject instanceof ZOHOCRMSDK.Record.ActionWrapper) {
                    let actionResponses = responseObject.getData();
                    actionResponses.forEach(actionResponse => {
                        if (actionResponse instanceof ZOHOCRMSDK.Record.SuccessResponse) {
                            let details = actionResponse.getDetails();
                            if (details != null) {
                                // Array.from(details.keys()).forEach(key => {
                                //     console.log(key + ": " + details.get(key));
                                // });
                            }
                            // console.log("Message: " + actionResponse.getMessage().getValue());
                        }
                        else if (actionResponse instanceof ZOHOCRMSDK.Record.APIException) {
                            let details = actionResponse.getDetails();
                            if (details != null) {
                                // Array.from(details.keys()).forEach(key => {
                                //     console.log(key + ": " + details.get(key));
                                // });
                            }
                        }
                    });
                }
                else if (responseObject instanceof ZOHOCRMSDK.Record.APIException) {
                    let details = responseObject.getDetails();
                    if (details != null) {
                        // Array.from(details.keys()).forEach(key => {
                        //     console.log(key + ": " + details.get(key));
                        // });
                    }
                }
            }
        }
    } catch (error) {
        throw new Error("Error updating sold item: ", error);
    }
}

export const createNewInstallation = async (equipmentDetails) => {
    try {
        await initializer();
    } catch (error) {
        throw new Error("Error Initializing CRM SDK: " + error);
    }
    try {
        await updateSoldItem(equipmentDetails.Sold_Item.id)
    } catch (error) {
        throw new Error("Error updating sold items: ", error);
    }
    try {
        let moduleAPIName = "Installed_Equipment";
        let recordOperations = new ZOHOCRMSDK.Record.RecordOperations();
        let request = new ZOHOCRMSDK.Record.BodyWrapper();
        let recordsArray = [];
        let record = new ZOHOCRMSDK.Record.Record();

        record.addKeyValue("Zone", equipmentDetails.Zone);
        record.addKeyValue("Device_Status", new ZOHOCRMSDK.Choice(equipmentDetails.Device_Status));
        record.addKeyValue("Device_Type",  new ZOHOCRMSDK.Choice(equipmentDetails.Device_Type));
        record.addKeyValue("Location", equipmentDetails.Location);
        record.addKeyValue("New_Existing",  new ZOHOCRMSDK.Choice(equipmentDetails.New_Existing));
        record.addKeyValue("Wired_Wireless",  new ZOHOCRMSDK.Choice(equipmentDetails.Wired_Wireless));
        record.addKeyValue("Part_Number", equipmentDetails.Part_Number);
        if(equipmentDetails.Alarm_Type) {
            record.addKeyValue("Alarm_Type", new ZOHOCRMSDK.Choice(equipmentDetails.Alarm_Type));
        }

        const dealRecord = new ZOHOCRMSDK.Record.Record();
        dealRecord.addFieldValue(ZOHOCRMSDK.Record.Field.Deals.ID, BigInt(equipmentDetails.System_Name));
        record.addKeyValue("Deal", dealRecord);

        const soldItemRecord = new ZOHOCRMSDK.Record.Record();
        soldItemRecord.addKeyValue("id", BigInt(equipmentDetails.Sold_Item.id));
        record.addKeyValue("Sold_Item", soldItemRecord);

        if(equipmentDetails.Technician) {
            const technicianRecord = new ZOHOCRMSDK.Record.Record();
            technicianRecord.addKeyValue("id", BigInt(equipmentDetails.Technician));
            record.addKeyValue("Technician", technicianRecord);
        }

        recordsArray.push(record);
        request.setData(recordsArray);
        let headerInstance = new ZOHOCRMSDK.HeaderMap();

        let response = await recordOperations.createRecords(moduleAPIName, request, headerInstance);
        if (response != null) {
            let responseObject = response.getObject();
            if (responseObject != null) {
                if (responseObject instanceof ZOHOCRMSDK.Record.ActionWrapper) {
                    let actionResponses = responseObject.getData();
                    actionResponses.forEach(actionResponse => {
                        if (actionResponse instanceof ZOHOCRMSDK.Record.SuccessResponse) {
                            let details = actionResponse.getDetails();
                            if (details != null) {
                                // Array.from(details.keys()).forEach(key => {
                                //     console.log(key + ": " + details.get(key));
                                // });
                            }
                            return {
                                status: details.get('Status Code'),
                                message: 'New Installed Equipment Added Successfully'
                            }
                        }
                        else if (actionResponse instanceof ZOHOCRMSDK.Record.APIException) {
                            let details = actionResponse.getDetails();
                            if (details != null) {
                                // Array.from(details.keys()).forEach(key => {
                                //     console.log(key + ": " + details.get(key));
                                // });
                                throw new Error("API Exception occured");
                            }
                        }
                    });
                }
                else if (responseObject instanceof ZOHOCRMSDK.Record.APIException) {
                    let details = responseObject.getDetails();
                    if (details != null) {
                        // Array.from(details.keys()).forEach(key => {
                        //     console.log(key + ": " + details.get(key));
                        // });
                        throw new Error("API Exception occured");
                    }
                }
            }
        }
    } catch (error) {
        console.log("Error creating new installed equipment: ", error);
        throw new Error("Error creating new installed equipment: ", error);
    }
}

export const getRelatedRecords = async () => {
    try {
        await initializer();
        const rl = await getInstalledEquipments(2148988000531135613n)
        // console.log("Response: ", rl);
        return rl;
    } catch (error) {
        console.log("Error getting related list: ", error);
        return {}
    }
}

const getRelatedList = async () => {
    let moduleAPIName = "Potentials";
    let relatedListsOperations = new ZOHOCRMSDK.ListsRelated.RelatedListsOperations(2148988000000091023n);
    let paraminstance = new ZOHOCRMSDK.ParameterMap();
    await paraminstance.add(ZOHOCRMSDK.ListsRelated.GetRelatedListsParam.MODULE, moduleAPIName);
    //Call getRelatedLists method
    let response = await relatedListsOperations.getRelatedLists(paraminstance);
    if (response != null) {
        // console.log("Status Code: " + response.getStatusCode());
        if ([204, 304].includes(response.getStatusCode())) {
            // console.log(response.getStatusCode() == 204 ? "No Content" : "Not Modified");
            return;
        }
        let responseObject = response.getObject();
        if (responseObject != null) {
            if (responseObject instanceof ZOHOCRMSDK.ListsRelated.ResponseWrapper) {
                let relatedLists = responseObject.getRelatedLists();
                relatedLists.forEach(relatedList => {
                    console.log("RelatedList SequenceNumber: " + relatedList.getSequenceNumber());
                    console.log("RelatedList DisplayLabel: " + relatedList.getDisplayLabel());
                    console.log("RelatedList APIName: " + relatedList.getAPIName());
                    console.log("RelatedList Module: " + relatedList.getModule());
                    console.log("RelatedList Name: " + relatedList.getName());
                    console.log("RelatedList Action: " + relatedList.getAction());
                    console.log("RelatedList ID: " + relatedList.getId());
                    console.log("RelatedList Href: " + relatedList.getHref());
                    console.log("RelatedList Type: " + relatedList.getType());
                    console.log("RelatedList Connectedmodule: " + relatedList.getConnectedmodule());
                    console.log("RelatedList Linkingmodule: " + relatedList.getLinkingmodule());
                    console.log();
                });
            }
            else if (responseObject instanceof ZOHOCRMSDK.ListsRelated.APIException) {
                console.log("Status: " + responseObject.getStatus().getValue());
                console.log("Code: " + responseObject.getCode().getValue());
                console.log("Details");
                let details = responseObject.getDetails();
                if (details != null) {
                    Array.from(details.keys()).forEach(key => {
                        console.log(key + ": " + details.get(key));
                    });
                }
                console.log("Message: " + responseObject.getMessage());
            }
        }
    }
    return {};
}

const getSingleRelatedList = async () => {
    let moduleAPIName = "Potentials";
    let relatedListId = 2148988000006202343n;
    let getVal = {};
    let relatedListsOperations = new ZOHOCRMSDK.ListsRelated.RelatedListsOperations(2148988000000091023n);
    let paramInstance = new ZOHOCRMSDK.ParameterMap();
    await paramInstance.add(ZOHOCRMSDK.ListsRelated.GetRelatedListParam.MODULE, moduleAPIName);
    //Call getRelatedList method which takes relatedListId as parameter
    let response = await relatedListsOperations.getRelatedList(relatedListId, paramInstance);
    if (response != null) {
        console.log("Status Code: " + response.getStatusCode());
        if ([204, 304].includes(response.getStatusCode())) {
            console.log(response.getStatusCode() == 204 ? "No Content" : "Not Modified");
            return;
        }
        let responseObject = response.getObject();
        if (responseObject != null) {
            if (responseObject instanceof ZOHOCRMSDK.ListsRelated.ResponseWrapper) {
                let relatedLists = responseObject.getRelatedLists();
                relatedLists.forEach(relatedList => {
                    console.log("RelatedList SequenceNumber: " + relatedList.getSequenceNumber());
                    console.log("RelatedList DisplayLabel: " + relatedList.getDisplayLabel());
                    console.log("RelatedList APIName: " + relatedList.getAPIName());
                    console.log("RelatedList Module: " + relatedList.getModule());
                    getVal["Module"] = relatedList.getModule();
                    console.log("RelatedList Name: " + relatedList.getName());
                    console.log("RelatedList Action: " + relatedList.getAction());
                    console.log("RelatedList ID: " + relatedList.getId());
                    console.log("RelatedList Href: " + relatedList.getHref());
                    console.log("RelatedList Type: " + relatedList.getType());
                    console.log("RelatedList Connectedmodule: " + relatedList.getConnectedmodule());
                    console.log("RelatedList Linkingmodule: " + relatedList.getLinkingmodule());
                });
            }
            else if (responseObject instanceof ZOHOCRMSDK.ListsRelated.APIException) {
                console.log("Status: " + responseObject.getStatus().getValue());
                console.log("Code: " + responseObject.getCode().getValue());
                console.log("Details");
                let details = responseObject.getDetails();
                if (details != null) {
                    Array.from(details.keys()).forEach(key => {
                        console.log(key + ": " + details.get(key));
                    });
                }
                console.log("Message: " + responseObject.getMessage());
            }
        }
    }
    return getVal;
}

// export const searchRecords = async (dealId) => {
//     //example



//     if (response != null) {
//         console.log("Status Code: " + response.getStatusCode());
//         if ([204, 304].includes(response.getStatusCode())) {
//             console.log(response.getStatusCode() == 204 ? "No Content" : "Not Modified");
//             return;
//         }

//         let responseObject = response.getObject();
//         if (responseObject != null) {
//             if (responseObject instanceof ZOHOCRMSDK.Record.ResponseWrapper) {
//                 let records = responseObject.getData();
//                 // console.log("Searched Records: ", records);
//                 console.log();
//                 let getValues = {};
//                 records.forEach(record => {
//                     const getKeyVal = record.getKeyValues();
//                     console.log("Searched Records: " + getKeyVal);
//                     console.log("Record ID: " + record.getId());

//                     for(const [key, value] of getKeyVal) {
//                         if(key === 'Account_Name') {
//                             getValues[key] =  value.keyValues.get('name');
//                         }
//                     }
//                     //     if(key === 'Account_Name') {
//                     //         console.log(`${key}: ${JSON.stringify(value)}`);

//                     //         // value.forEach(val => {
//                     //         //     console.log(val);
//                     //         // })
//                     //     }
//                     // }
//                     // let createdBy = record.getCreatedBy();
//                     // if (createdBy != null) {
//                     //     console.log("Record Created By User-ID: " + createdBy.getId());
//                     //     console.log("Record Created By User-Name: " + createdBy.getName());
//                     //     console.log("Record Created By User-Email: " + createdBy.getEmail());
//                     // }
//                     // console.log("Record CreatedTime: " + record.getCreatedTime());
//                     // let modifiedBy = record.getModifiedBy();
//                     // if (modifiedBy != null) {
//                     //     console.log("Record Modified By User-ID: " + modifiedBy.getId());
//                     //     console.log("Record Modified By User-Name: " + modifiedBy.getName());
//                     //     console.log("Record Modified By User-Email: " + modifiedBy.getEmail());
//                     // }
//                     // console.log("Record ModifiedTime: " + record.getModifiedTime());
//                     // let tags = record.getTag();
//                     // if (tags != null) {
//                     //     tags.forEach(tag => {
//                     //         console.log("Record Tag Name: " + tag.getName());
//                     //         console.log("Record Tag ID: " + tag.getId());
//                     //     });
//                     // }
//                     //To get particular field value
//                     // console.log("Record Field Value: " + record.getKeyValue("Last_Name"));// FieldApiName
//                     // console.log("Record KeyValues: ");
//                     // let keyValues = record.getKeyValues();
//                     // let keyArray = Array.from(keyValues.keys());
//                     // keyArray.forEach(keyName => {
//                     //     let value = keyValues.get(keyName);
//                     //     if (value != null) {
//                     //         if (Array.isArray(value)) {
//                     //             if (value.length > 0) {
//                     //                 if (value[0] instanceof ZOHOCRMSDK.Record.FileDetails) {
//                     //                     let fileDetails = value;
//                     //                     fileDetails.forEach(fileDetail => {
//                     //                         console.log("Record FileDetails FileIds: " + fileDetail.getFileIdS());
//                     //                         console.log("Record FileDetails FileNameS: " + fileDetail.getFileNameS());
//                     //                         console.log("Record FileDetails SizeS: " + fileDetail.getSizeS());
//                     //                         console.log("Record FileDetails Id: " + fileDetail.getId());
//                     //                     });
//                     //                 }
//                     //                 else if (value[0] instanceof ZOHOCRMSDK.Choice) {
//                     //                     let choiceArray = value;
//                     //                     console.log(keyName);
//                     //                     console.log("Values");
//                     //                     choiceArray.forEach(eachChoice => {
//                     //                         console.log(eachChoice.getValue());
//                     //                     });
//                     //                 }
//                     //                 else if (value[0] instanceof ZOHOCRMSDK.Tags.Tag) {
//                     //                     let tags1 = value;
//                     //                     tags1.forEach(tag => {
//                     //                         console.log("Record Tag Name: " + tag.getName());
//                     //                         console.log("Record Tag ID: " + tag.getId());
//                     //                     });
//                     //                 }
//                     //                 else if (value[0] instanceof ZOHOCRMSDK.Record.PricingDetails) {
//                     //                     let pricingDetails = value;
//                     //                     pricingDetails.forEach(pricingDetail => {
//                     //                         console.log("Record PricingDetails ToRange: " + pricingDetail.getToRange().toString());
//                     //                         console.log("Record PricingDetails Discount: " + pricingDetail.getDiscount().toString());
//                     //                         console.log("Record PricingDetails ID: " + pricingDetail.getId());
//                     //                         console.log("Record PricingDetails FromRange: " + pricingDetail.getFromRange().toString());
//                     //                     });
//                     //                 }
//                     //                 else if (value[0] instanceof ZOHOCRMSDK.Record.Participants) {
//                     //                     let participants = value;
//                     //                     participants.forEach(participant => {
//                     //                         console.log("Record Participants Name: " + participant.getName());
//                     //                         console.log("Record Participants Invited: " + participant.getInvited().toString());
//                     //                         console.log("Record Participants ID: " + participant.getId());
//                     //                         console.log("Record Participants Type: " + participant.getType());
//                     //                         console.log("Record Participants Participant: " + participant.getParticipant());
//                     //                         console.log("Record Participants Status: " + participant.getStatus());
//                     //                     });
//                     //                 }
//                     //                 else if (value[0] instanceof ZOHOCRMSDK.Record.Record) {
//                     //                     let recordArray = value;
//                     //                     recordArray.forEach(record1 => {
//                     //                         Array.from(record1.getKeyValues().keys()).forEach(key => {
//                     //                             console.log(key + ": " + record1.getKeyValues().get(key));
//                     //                         });
//                     //                     });
//                     //                 }
//                     //                 else if (value[0] instanceof ZOHOCRMSDK.Record.LineTax) {
//                     //                     let lineTaxes = value;
//                     //                     lineTaxes.forEach(lineTax => {
//                     //                         console.log("Record ProductDetails LineTax Percentage: " + lineTax.getPercentage().toString());
//                     //                         console.log("Record ProductDetails LineTax Name: " + lineTax.getName());
//                     //                         console.log("Record ProductDetails LineTax Id: " + lineTax.getId());
//                     //                         console.log("Record ProductDetails LineTax Value: " + lineTax.getValue().toString());
//                     //                     });
//                     //                 }
//                     //                 else if (value[0] instanceof ZOHOCRMSDK.Record.Comment) {
//                     //                     let comments = value;
//                     //                     comments.forEach(comment => {
//                     //                         console.log("Record Comment CommentedBy: " + comment.getCommentedBy());
//                     //                         console.log("Record Comment CommentedTime: " + comment.getCommentedTime().toString());
//                     //                         console.log("Record Comment CommentContent: " + comment.getCommentContent());
//                     //                         console.log("Record Comment Id: " + comment.getId());
//                     //                     });
//                     //                 }
//                     //                 else if (value[0] instanceof ZOHOCRMSDK.Attachments.Attachment) {
//                     //                     let attachments = value;
//                     //                     attachments.forEach(attachment => {
//                     //                         console.log("Record Attachment ID: " + attachment.getId());
//                     //                         let owner = attachment.getOwner();
//                     //                         if (owner != null) {
//                     //                             console.log("Record Attachment Owner - Name: " + owner.getName());
//                     //                             console.log("Record Attachment Owner ID: " + owner.getId());
//                     //                             console.log("Record Attachment Owner Email: " + owner.getEmail());
//                     //                         }
//                     //                         console.log("Record Attachment Modified Time: " + attachment.getModifiedTime().toString());
//                     //                         console.log("Record Attachment File Name: " + attachment.getFileName());
//                     //                         console.log("Record Attachment Created Time: " + attachment.getCreatedTime());
//                     //                         console.log("Record Attachment File Size: " + attachment.getSize());
//                     //                         let parentId = attachment.getParentId();
//                     //                         if (parentId != null) {
//                     //                             console.log("Record Attachment parent record Name: " + parentId.getKeyValue("name"));
//                     //                             console.log("Record Attachment parent record ID: " + parentId.getId());
//                     //                         }
//                     //                         console.log("Record Attachment is Editable: " + attachment.getEditable().toString());
//                     //                         console.log("Record Attachment File ID: " + attachment.getFileId());
//                     //                         console.log("Record Attachment File Type: " + attachment.getType());
//                     //                         console.log("Record Attachment seModule: " + attachment.getSeModule());
//                     //                         let modifiedBy1 = attachment.getModifiedBy();
//                     //                         if (modifiedBy1 != null) {
//                     //                             console.log("Record Attachment Modified By User-Name: " + modifiedBy1.getName());
//                     //                             console.log("Record Attachment Modified By User-ID: " + modifiedBy1.getId());
//                     //                             console.log("Record Attachment Modified By User-Email: " + modifiedBy1.getEmail());
//                     //                         }
//                     //                         console.log("Record Attachment State: " + attachment.getState());
//                     //                         let createdBy1 = attachment.getCreatedBy();
//                     //                         if (createdBy1 != null) {
//                     //                             console.log("Record Attachment Created By User-Name: " + createdBy1.getName());
//                     //                             console.log("Record Attachment Created By User-ID: " + createdBy1.getId());
//                     //                             console.log("Record Attachment Created By User-Email: " + createdBy1.getEmail());
//                     //                         }
//                     //                         console.log("Record Attachment LinkUrl: " + attachment.getLinkUrl());
//                     //                     });
//                     //                 }
//                     //                 else if (value[0] instanceof ZOHOCRMSDK.Record.Reminder) {
//                     //                     let reminders = value;
//                     //                     reminders.forEach(reminder => {
//                     //                         console.log("Reminder Period: " + reminder.getPeriod());
//                     //                         console.log("Reminder Unit: " + reminder.getUnit());
//                     //                     });
//                     //                 }
//                     //                 else {
//                     //                     console.log(keyName + ": " + value);
//                     //                 }
//                     //             }
//                     //         }
//                     //         else if (value instanceof ZOHOCRMSDK.Users.Users) {
//                     //             console.log("Record " + keyName + " User-ID: " + value.getId());
//                     //             console.log("Record " + keyName + " User-Name: " + value.getName());
//                     //             console.log("Record " + keyName + " User-Email: " + value.getEmail());
//                     //         }
//                     //         else if (value instanceof ZOHOCRMSDK.Layouts.Layouts) {
//                     //             console.log(keyName + " ID: " + value.getId());
//                     //             console.log(keyName + " Name: " + value.getName());
//                     //         }
//                     //         else if (value instanceof ZOHOCRMSDK.Record.Record) {
//                     //             console.log(keyName + " Record ID: " + value.getId());
//                     //             console.log(keyName + " Record Name: " + value.getKeyValue("name"));
//                     //         }
//                     //         else if (value instanceof ZOHOCRMSDK.Choice) {
//                     //             console.log(keyName + ": " + value.getValue());
//                     //         }
//                     //         else if (value instanceof ZOHOCRMSDK.Record.RemindAt) {
//                     //             console.log(keyName + ": " + value.getAlarm());
//                     //         }
//                     //         else if (value instanceof ZOHOCRMSDK.Record.RecurringActivity) {
//                     //             console.log(keyName);
//                     //             console.log("RRULE: " + value.getRrule());
//                     //         }
//                     //         else if (value instanceof ZOHOCRMSDK.Record.Consent) {
//                     //             console.log("Record Consent ID: " + value.getId());
//                     //             let owner = value.getOwner();
//                     //             if (owner != null) {
//                     //                 console.log("Record Consent Owner Name: " + owner.getName());
//                     //                 console.log("Record Consent Owner ID: " + owner.getId());
//                     //                 console.log("Record Consent Owner Email: " + owner.getEmail());
//                     //             }
//                     //             let consentCreatedBy = value.getCreatedBy();
//                     //             if (consentCreatedBy != null) {
//                     //                 console.log("Record Consent CreatedBy Name: " + consentCreatedBy.getName());
//                     //                 console.log("Record Consent CreatedBy ID: " + consentCreatedBy.getId());
//                     //                 console.log("Record Consent CreatedBy Email: " + consentCreatedBy.getEmail());
//                     //             }
//                     //             let consentModifiedBy = value.getModifiedBy();
//                     //             if (consentModifiedBy != null) {
//                     //                 console.log("Record Consent ModifiedBy Name: " + consentModifiedBy.getName());
//                     //                 console.log("Record Consent ModifiedBy ID: " + consentModifiedBy.getId());
//                     //                 console.log("Record Consent ModifiedBy Email: " + consentModifiedBy.getEmail());
//                     //             }
//                     //             console.log("Record Consent CreatedTime: " + value.getCreatedTime());
//                     //             console.log("Record Consent ModifiedTime: " + value.getModifiedTime());
//                     //             console.log("Record Consent ContactThroughEmail: " + value.getContactThroughEmail());
//                     //             console.log("Record Consent ContactThroughSocial: " + value.getContactThroughSocial());
//                     //             console.log("Record Consent ContactThroughSurvey: " + value.getContactThroughSurvey());
//                     //             console.log("Record Consent ContactThroughPhone: " + value.getContactThroughPhone());
//                     //             console.log("Record Consent MailSentTime: " + value.getMailSentTime().toString());
//                     //             console.log("Record Consent ConsentDate: " + value.getConsentDate().toString());
//                     //             console.log("Record Consent ConsentRemarks: " + value.getConsentRemarks());
//                     //             console.log("Record Consent ConsentThrough: " + value.getConsentThrough());
//                     //             console.log("Record Consent DataProcessingBasis: " + value.getDataProcessingBasis());
//                     //             //To get custom values
//                     //             console.log("Record Consent Lawful Reason: " + value.getKeyValue("Lawful_Reason"));
//                     //         }
//                     //         else if (value instanceof Map) {
//                     //             console.log(keyName);
//                     //             Array.from(value.keys()).forEach(key => {
//                     //                 console.log(key + ": " + value.get(key));
//                     //             });
//                     //         }
//                     //         else {
//                     //             console.log(keyName + ": " + value);
//                     //         }
//                     //     }
//                     // });
//                 });
//                 // console.log(getValues);

//                 return getValues;
//             }
//             else if (responseObject instanceof ZOHOCRMSDK.Record.APIException) {
//                 console.log("Status: " + responseObject.getStatus().getValue());
//                 console.log("Code: " + responseObject.getCode().getValue());
//                 console.log("Details");
//                 let details = responseObject.getDetails();
//                 if (details != null) {
//                     Array.from(details.keys()).forEach(key => {
//                         console.log(key + ": " + details.get(key));
//                     });
//                 }
//                 console.log("Message: " + responseObject.getMessage().getValue());
//             }
//         }
//     }
// }
