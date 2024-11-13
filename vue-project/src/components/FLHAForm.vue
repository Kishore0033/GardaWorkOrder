<template>
    <div class="flha-body-container">
        <div class="flha-values-main-container">
            <div id="section-1">
                <div class="flha-values-container" style="margin-top: 0px;">
                    <p class="flha-title">Ergonomic</p>
                    <a-checkbox-group v-model:value="FLHAValues.Ergonomic" style="width: 20%;">
                        <a-row>
                            <a-col :span="24" v-for="value in FLHAOptions.Ergonomic">
                                <a-checkbox :value="value"><span class="checkbox-values">{{ value }}</span></a-checkbox>
                            </a-col>
                        </a-row>
                    </a-checkbox-group>
                </div>
                <div class="flha-values-container">
                    <p class="flha-title">Personal Limitations</p>
                    <a-checkbox-group v-model:value="FLHAValues['Personal Limitations']" style="width: 20%;">
                        <a-row>
                            <a-col :span="24" v-for="value in FLHAOptions['Personal Limitations']">
                                <a-checkbox :value="value"><span class="checkbox-values">{{ value }}</span></a-checkbox>
                            </a-col>
                        </a-row>
                    </a-checkbox-group>
                </div>
                <div class="flha-values-container">
                    <p class="flha-title">Overhead</p>
                    <a-checkbox-group v-model:value="FLHAValues.Overhead" style="width: 20%;">
                        <a-row>
                            <a-col :span="24" v-for="value in FLHAOptions.Overhead">
                                <a-checkbox :value="value"><span class="checkbox-values">{{ value }}</span></a-checkbox>
                            </a-col>
                        </a-row>
                    </a-checkbox-group>
                </div>
            </div>
            <div id="section-2">
                <div class="flha-values-container" style="margin-top: 0px;">
                    <p class="flha-title">Electrical</p>
                    <a-checkbox-group v-model:value="FLHAValues.Electrical" style="width: 20%;">
                        <a-row>
                            <a-col :span="24" v-for="value in FLHAOptions.Electrical">
                                <a-checkbox :value="value"><span class="checkbox-values">{{ value }}</span></a-checkbox>
                            </a-col>
                        </a-row>
                    </a-checkbox-group>
                </div>
                <div class="flha-values-container">
                    <p class="flha-title">Environmental</p>
                    <a-checkbox-group v-model:value="FLHAValues.Environmental" style="width: 20%;">
                        <a-row>
                            <a-col :span="24" v-for="value in FLHAOptions.Environmental">
                                <a-checkbox :value="value"><span class="checkbox-values">{{ value }}</span></a-checkbox>
                            </a-col>
                        </a-row>
                    </a-checkbox-group>
                </div>
                <div class="flha-values-container">
                    <p class="flha-title">Access/Egress</p>
                    <a-checkbox-group v-model:value="FLHAValues['Access/Egress']" style="width: 20%;">
                        <a-row>
                            <a-col :span="24" v-for="value in FLHAOptions['Access/Egress']">
                                <a-checkbox :value="value"><span class="checkbox-values">{{ value }}</span></a-checkbox>
                            </a-col>
                        </a-row>
                    </a-checkbox-group>
                </div>
            </div>
            <div id="section-3">
                <div class="flha-values-container" style="margin-top: 0px;">
                    <p class="flha-title">Severity</p>
                    <ol>
                        <li><strong>Imminent Danger</strong> - Causing deaths, widespread occupational illness, loss of facilities</li>
                        <li><strong>Serious</strong> - Serious injury/ illness, property and/ or equipment damage</li>
                        <li><strong>Minor</strong> - Non-serious injury, illness or damage</li>
                        <li><strong>Not Applicable</strong> - N/A</li>
                    </ol>
                </div>
                <div class="flha-values-container">
                    <p class="flha-title">Probability</p>
                    <ol>
                        <li><strong>Probably</strong> - Likely to occur immediately or soon</li>
                        <li><strong>Reasonably Probable</strong> - Likely to occur eventually</li>
                        <li><strong>Remote</strong> - Could occur at some point</li>
                        <li><strong>Extremely Remote</strong> - Unlikely to occur</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FLHAForm',
    data() {
        return {
            FLHAOptions: {
                Ergonomic: [
                    "Repetitive Motion",
                    "Awkward Body Position",
                    "Over Extension",
                    "Too Heavy/Awkward to Lift/Lift on Incline",
                    "Working Above Your Head",
                    "Hands Not in Line of Sight"
                ],
                'Personal Limitations': [
                    "First Time Performing Task",
                    "Confusing Instructions",
                    "No Training for Task or Tools",
                    "Procedure not Available"
                ],
                Overhead: [
                    "Harness/Lanyard Inspected",
                    "Fall Arrest Anchor Point/Correct Sling",
                    "Falling Objects"
                ],
                Electrical: [
                    "Working On/Near Energized Equipment",
                    "Fire Extinguishers",
                    "Electrical Cords/Tools Conditions",
                    "Lighting Levels Too Low"
                ],
                Environmental: [
                    "Work Area Clean",
                    "Dust/Mist/Fumes",
                    "Noise in Area",
                    "Extreme Temperatures",
                    "Weather Conditions",
                    "Driving Conditions",
                    "Other Workers in Area"
                ],
                'Access/Egress': [
                    "Slips/Trips",
                    "Ladders (Tied Off/Proper Height)",
                    "Aerial Lift/Man Basket (Inspected & Tagged)",
                    "Hoisting (Tools, Equip)",
                    "Evacuation (Alarms,Routes,Phone #’s)"
                ]
            },
            FLHAValues: {
                Ergonomic: [],
                'Personal Limitations': [],
                Overhead: [],
                Electrical: ["Working On/Near Energized Equipment", "Electrical Cords/Tools Conditions"],
                Environmental: ["Work Area Clean", "Driving Conditions"],
                'Access/Egress': ["Slips/Trips"]
            },
            getAllFlha: []
        }
    },
    watch: {
        FLHAValues: {
            handler: 'updateAllFlha',
            deep: true
        }
    },
    mounted() {
        setTimeout(() => {
            this.$emit('loader', false);
            this.updateAllFlha();
        }, 100);
    },
    methods: {
        updateAllFlha() {
            this.getAllFlha = Object.values(this.FLHAValues).flat();
        }
    }
}
</script>

<style>
.flha-body-container {
    height: 63vh;
    overflow: auto;
    background-color: white;
    border-radius: 10px;
    padding: 20px 30px;
    padding-bottom: 50px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}
.flha-values-main-container {
    display: flex;
    justify-content: space-around;
}
#section-1,
#section-2,
#section-3 {
    width: 30%;
    background-color: white;
}
.flha-title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
}
.flha-values-container {
    margin-top: 20px;
}
.checkbox-values {
    font-size: 12px;
}
ol li {
    font-size: 12px;
    margin-bottom: 4px;
}
</style>