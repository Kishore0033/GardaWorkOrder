<script setup>
import { DownOutlined, GlobalOutlined, CheckCircleFilled, ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';
</script>
<template>
    <div class="form-header-body-container">
        <div class="form-header-container">
            <p id="work-order-form-title">{{ $t('workOrderFormTitle') }}</p>
            <div class="language-selector">
                <a-dropdown>
                    <a class="ant-dropdown-link" @click.prevent>
                        <GlobalOutlined style="font-size: 14px; margin-right: 5px;" />
                        {{ $t('changeLanguage') }}
                        <DownOutlined style="font-size: 12px;" />
                    </a>
                    <template #overlay>
                        <a-menu>
                            <a-menu-item>
                                <a href="javascript:;" @click="changeLanguage('en')">
                                    <CheckCircleFilled style="font-size: 12px; margin-right: 3px; color: #49af41;"
                                        v-if="setup.language === 'en'" />
                                    <span style="margin-right: 18px;" v-else></span>
                                    English
                                </a>
                            </a-menu-item>
                            <a-menu-item>
                                <a href="javascript:;" @click="changeLanguage('fr')">
                                    <CheckCircleFilled style="font-size: 12px; margin-right: 3px; color: #49af41;"
                                        v-if="setup.language === 'fr'" />
                                    <span style="margin-right: 18px;" v-else></span>
                                    French
                                </a>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </div>
        <div class="form-header-steps-container">
            <a-steps :current="currentStep" :items="formSteps" type="navigation" size="small"
                :style="stepStyle" :class="'custom-step'" v-if="!mobileView"></a-steps>
             <div class="mobile-steps-container" v-else>
           <div class="steps-item step-item-active">
                <CheckCircleFilled class="step-completed-icon" style="color: #ea3a34; font-size: 26px;" v-if="currentStep + 1 > 1" />
                <span v-else :class="'steps-count-icon ' + ((currentStep+1 === 1) ? 'steps-count-icon-active' : '')">1</span>
                <span>{{ $t("steps.jobInformation") }}</span>
              </div>
              <div class="steps-item">
                <CheckCircleFilled class="step-completed-icon" style="color: #ea3a34; font-size: 26px;" v-if="currentStep + 1 > 2" />
                  <span v-else :class="'steps-count-icon ' + ((currentStep+1 === 2) ? 'steps-count-icon-active' : '')">2</span>
                <span>FLHA</span>
              </div>
              <div class="steps-item">
                <CheckCircleFilled class="step-completed-icon" style="color: #ea3a34; font-size: 26px;" v-if="currentStep + 1 > 3" />
                  <span v-else :class="'steps-count-icon ' + ((currentStep+1 === 3) ? 'steps-count-icon-active' : '')">3</span>
                <span>{{ $t("steps.workOrder") }}</span>
              </div>
              <div class="steps-item">
                <CheckCircleFilled class="step-completed-icon" style="color: #ea3a34; font-size: 26px;" v-if="currentStep + 1 > 4" />
                  <span v-else :class="'steps-count-icon ' + ((currentStep+1 === 4) ? 'steps-count-icon-active' : '')">4</span>
                <span>{{ $t("steps.signatures") }}</span>
              </div>
            </div>

					<!-- <nav class="form-steps">
						<div class="form-steps__item form-steps__item--active">
							<div class="form-steps__item-content">
								<span class="form-steps__item-icon">1</span>
								<span class="form-steps__item-text">Job Information</span>
							</div>

						</div>
						<div class="form-steps__item">
							<div class="form-steps__item-content">
								<span class="form-steps__item-icon">2</span>
								<span class="form-steps__item-line"></span>
								<span class="form-steps__item-text">Work Order</span>
							</div>
						</div>
						<div class="form-steps__item">
							<div class="form-steps__item-content">
								<span class="form-steps__item-icon">3</span>
								<span class="form-steps__item-line"></span>
								<span class="form-steps__item-text">Signature</span>
							</div>
						</div>
					</nav> -->

            </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "FormHeader",
    props: {
        currentStep: Number
    },
    data() {
        return {
          mobileView: false,
            setup: {
                language: 'en'
            },
            stepStyle: {
                marginBottom: '60px',
                backgroundColor: 'whitesmoke',
                boxShadow: '0px -1px 0 0 #e8e8e8 inset',
            }
        };
    },
    computed: {
        formSteps() {
            return [
                { title: this.$t("steps.jobInformation") },
                { title: 'FLHA' },
                { title: this.$t("steps.workOrder") },
                { title: this.$t("steps.signatures") },
            ];
        }
    },
    mounted: async function() {
        // try {
        //     const getLang = await axios.get('/server/work_order_function/api/settings/lang');
        //     console.log("Mounted Lang: ", getLang.data);
        //     this.setup.language = getLang.data;
        //     console.log("Mounted Lang: ", this.setup.language);
        // } catch (error) {
        //     console.error("Error fetching language settings:", error);
        // }

        this.checkMobileView();
        window.addEventListener('resize', this.checkMobileView);

        this.setup.language = this.$route.params.lang || 'en';
    },
    methods: {
      checkMobileView() {
        if(window.innerWidth <= 576) {
          this.mobileView = true;
        } else {
          this.mobileView = false;
        }
      },
        onStepsChange(currentStep) {
            this.currentStep = currentStep;
            this.$emit('stepUpdate', currentStep);
        },
        async changeLanguage(lang) {
            // this.$i18n.locale = lang; // Change locale dynamically
            this.$emit('loader', true);
            if(this.$route.query.id) {
              this.$router.push(`/${lang}?id=${this.$route.query.id}`);
            } else {
              this.$router.push(`/${lang}`);
            }
            setTimeout(() => {
                window.location.reload();
            }, 200)
            // try {
            //     await axios.post('/server/work_order_function/api/settings/lang', {
            //         language: lang
            //     })
            //     window.location.reload();
            // } catch(e) {
            //     console.log("Error updating language: ", e);
            //     this.$emit('loader', false);
            // }
            // this.setup.language = lang;
        }
    }
};
</script>

<style scoped>
.form-header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    padding-left: 20px;
    margin-bottom: 10px;
    background-color: #252929;
    color: whitesmoke;
}

.form-header-steps-container {
    margin-top: -12px;
    margin-bottom: -60px;
}

#work-order-form-title {
    width: 50%;
    font-size: 18px;
    font-weight: 600;
}

.ant-dropdown-link {
    color: white;
}

.ant-dropdown-link:hover {
    color: #e6706c;
    cursor: pointer;
}

:deep(.custom-step .ant-steps-item-process .ant-steps-item-icon) {
  background-color: #d52b1e !important;
  border-color: #d52b1e !important;
}

:deep(.custom-step .ant-steps-item-process .ant-steps-item-title) {
  color: #d52b1e !important;
}

:deep(.custom-step .ant-steps-item-finish .ant-steps-item-icon) {
  background-color: #ffeded !important;
  border-color: #d52b1e !important;
}

:deep(.custom-step .ant-steps-item-finish .ant-steps-item-icon .ant-steps-icon) {
  color: #d52b1e !important;
}

:deep(.custom-step .ant-steps-item-finish .ant-steps-item-title) {
  color: #d52b1e !important;
}

:deep(.custom-step .ant-steps-item:hover .ant-steps-item-icon) {
  border-color: #d52b1e !important;
}

:deep(.custom-step .ant-steps-item:hover .ant-steps-item-title) {
  color: #d52b1e !important;
}

:deep(.custom-step .ant-steps-item-active::before) {
  border-bottom: 2px solid #d52b1e !important;
}

:deep(.custom-step .ant-steps-item-active .ant-steps-item-title) {
  color: #d52b1e !important;
}

:deep(.custom-step .ant-steps-item-finish .ant-steps-item-title) {
  color: #d52b1e !important;
}

:deep(.custom-step .ant-steps-item-finish .ant-steps-item-icon) {
  border-color: #d52b1e !important;
}

:deep(.custom-step .ant-steps-item-finish::before) {
  border-bottom: 2px solid #d52b1e !important;
}

:deep(.custom-step .ant-steps-item-process .ant-steps-item-title),
:deep(.custom-step .ant-steps-item-process .ant-steps-item-icon) {
  color: #d52b1e !important;
  border-color: #d52b1e !important;
}

:deep(.custom-step .ant-steps-item:hover .ant-steps-item-title) {
  color: #d52b1e !important;
}

:deep(.custom-step .ant-steps-item:hover .ant-steps-item-icon) {
  border-color: #d52b1e !important;
}

:deep(.custom-step .ant-steps-item-active .ant-steps-item-icon) {
  border-color: #d52b1e !important;
}

:deep(.custom-step .ant-steps-item-active .ant-steps-item-title) {
  color: #d52b1e !important;
}

:deep(.custom-step .ant-steps-item-active::before) {
  border-bottom: 2px solid #d52b1e !important;
}

:deep(.ant-spin-dot-item) {
  background-color: #ef3022 !important;
}

:deep(.ant-spin-dot) {
  border-color: #ef3022 !important;
  border-top-color: transparent !important;
}

/*

/* :deep(.custom-step .ant-steps-item-container:hover {
    border-color: red !important;
    color: red !important;
} */

/* .form-steps {
  display: block;
  width: 100%;
  position: relative;
  margin-left: 20px !important;
  margin: 25px 0 50px 0px;
}
.form-steps:after {
  content: "";
  display: table;
  clear: both;
}
.form-steps__item {
  padding: 0;
  position: relative;
  display: block;
  float: left;
  width: 32%;
  text-align: center;
}
.form-steps__item-content {
  display: inline-block;
}
.form-steps__item-icon {
  background: #eceff1;
  color: #8191ab;
  display: block;
  border-radius: 100%;
  text-align: center;
  width: 25px;
  height: 25px;
  line-height: 25px;
  margin: 0 auto 10px auto;
  position: relative;
  font-size: 13px;
  font-weight: 700;
  z-index: 2;
}
.form-steps__item-text {
  margin-top: -20px;
  font-size: 13px;
  color: #8191ab;
  font-weight: 500;
}
.form-steps__item-line {
  display: inline-block;
  height: 3px;
  width: 100%;
  background: #cfd8dc;
  float: left;
  position: absolute;
  left: -50%;
  top: 12px;
  z-index: 1;
}
.form-steps__item--active .form-steps__item-icon {
  background: #ea3a34;
  color: #ffffff;
}
.form-steps__item--active .form-steps__item-text {
  color: #4f5e77;
}
.form-steps__item--active .form-steps__item-line {
  background: #ea3a34;
}
.form-steps__item--completed .form-steps__item-text {
  color: #4f5e77;
}
.form-steps__item--completed .form-steps__item-icon {
  background: #ea3a34;
  background-image: url(data:image/svg+xml;base64,PHN2ZyBkYXRhLW5hbWU9IkxheWVyIDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDkuMTIgNyI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTkuMTIgMS4wNkw4LjA2IDAgMy4xOCA0Ljg4IDEuMDYgMi43NiAwIDMuODIgMy4xOCA3bDUuOTQtNS45NHoiLz48L3N2Zz4=);
  color: transparent;
  background-size: 10px;
  background-repeat: no-repeat;
  background-position: center center;
  width: 25px;
  height: 25px;
  line-height: 25px;
}
.form-steps__item--completed .form-steps__item-line {
  background: #ea3a34;
} */

.mobile-steps-container {
  display: flex;
  justify-content: space-between;
  padding: 15px 25px;
  margin-bottom: 60px;
  margin-top: 10px;
  border-bottom: 1px solid rgb(212, 212, 212);
}

.steps-item {
  width: 30%;
  text-align: center;
  font-size: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.steps-count-icon {
  background-color: #E7E7E7;
  border-radius: 50%;
  padding: 5px 10px;
  color: #515151;
  /* margin-right: 10px;
  margin-left: -10px; */
  margin-bottom: 5px;
  font-size: 12px;
}

.step-completed-icon {
  margin-bottom: 5px;
}

/* .step-item-active {
  border-bottom: 2px solid #d52b1e;
} */

.steps-count-icon-active {
  background-color: #ea3a34;
  color: white;
  border-bottom: 1px solid #d52b1e;
}

@media only screen and (max-width: 576px) {
    body {
        font-size: 14px;
        background-color: #e0e0e0;
    }
    #work-order-form-title {
      font-size: 14px !important;
    }
}

</style>
