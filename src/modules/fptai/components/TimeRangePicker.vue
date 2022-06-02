<template>
    <div> <!-- wrapping this inside a div since v-menu will create a menu outside of the activator-->
        <v-menu
            v-model="showPopup"
            lazy
            transition="scale-transition"
            offset-y
            :close-on-content-click="false"
        >
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" :class="buttonClassName">
                    <v-icon class="mr-2" color="rgba(0,0,0,0.54)">mdi-calendar</v-icon>
                    {{textButton}}
                </v-btn>
            </template>
            <div class="menu-container" :class="{mobile: utils.isMobile()}">
                <div style="min-height: 430px">
                    <v-tabs v-model="activeTab" color="rgba(0,0,0,0)" slider-color="#01AFC8">
                        <v-tab ripple>{{$t('quick')}}</v-tab>
                        <v-tab ripple>{{$t('absolute')}}</v-tab>
                        <v-tabs-items touchless>
                            <v-tab-item>
                                <v-layout class="pt-3">
                                    <v-flex v-for="(group, groupIndex) in optionGroup" :key="groupIndex">
                                        <div
                                            v-for="(option, optionIndex) in group"
                                            :key="optionIndex"
                                            class="pa-1 px-1 option"
                                            @click="quickSelect(option)"
                                            :class="{'active': option.value === model}"
                                        >
                                            <a>{{getOptionText(option)}}</a>
                                        </div>
                                    </v-flex>
                                </v-layout>
                            </v-tab-item>
                            <v-tab-item>
                                <v-layout class="pt-3" row wrap>
                                    <v-flex>
                                        <v-text-field
                                            :label="$t('from') | capitalize"
                                            v-model="fromDate"
                                            prepend-inner-icon="mdi-calendar"
                                            readonly
                                            class="mr-1"
                                        ></v-text-field>
                                        <v-date-picker
                                            v-model="fromDate"
                                            no-title
                                            show-current
                                            :max="toDate"
                                            class="elevation-0"
                                        ></v-date-picker>
                                    </v-flex>
                                    <v-flex>
                                        <v-text-field
                                            :label="$t('to') | capitalize"
                                            v-model="toDate"
                                            prepend-inner-icon="mdi-calendar"
                                            readonly
                                        ></v-text-field>
                                        <v-date-picker
                                            v-model="toDate"
                                            no-title
                                            show-current
                                            :min="fromDate"
                                            :max="today"
                                            class="elevation-0"
                                        ></v-date-picker>
                                    </v-flex>
                                </v-layout>
                            </v-tab-item>
                        </v-tabs-items>
                    </v-tabs>
                </div>
                <v-layout justify-end>
                    <v-btn color="primary" @click="apply">{{$t('apply')}}</v-btn>
                </v-layout>
            </div>
        </v-menu>
    </div>
</template>

<script>
import { optionGroup, optionList } from '@/modules/fptai/components/TimeRangePickerQuickOptions'
import moment from 'moment'

export default {
    name: 'TimeRangePicker',
    props: {
        value: String,
        buttonClassName: String
    },
    data () {
        return {
            showPopup: false,
            activeTab: 0,
            model: '',
            quickOption: null,
            today: moment().format('YYYY-MM-DD'),
            fromDate: moment().subtract(1, 'week').format('YYYY-MM-DD'),
            toDate: moment().format('YYYY-MM-DD'),
            textButton: this.$t('timeRange'),
            selectType: 0,
            utils: this.$utils,
            optionList: [],
            optionGroup: optionGroup,
            chartIntervalList: [
                { i18n: 'minute', value: '1m', second: 60, disabled: false },
                { i18n: 'hour', value: '1h', second: 60 * 60, disabled: false },
                { i18n: 'day', value: '1d', second: 60 * 60 * 24, disabled: false },
                { i18n: 'month', value: '1M', second: 60 * 60 * 24 * 30, disabled: false },
                { i18n: 'year', value: '1y', second: 60 * 60 * 24 * 30 * 12, disabled: false }
            ],
            maxChartIntervalListLength: 60
        }
    },
    methods: {
        getOptionText (option) {
            if (option.amount) {
                let i18n = {
                    time: option.amount,
                    unit: this.$t(option.i18n)
                }
                if (this.$appService.getLocale() === 'en' && option.amount > 1) {
                    i18n.unit = i18n.unit + 's'
                }
                return this.$t('lastTimeUnit', i18n)
            }
            return this.$t(option.i18n)
        },
        quickSelect (option) {
            this.model = option.value
            this.quickOption = option
            this.apply()
        },
        apply () {
            this.selectType = this.activeTab
            if (this.selectType === 1) {
                this.model = this.fromDate + ' --> ' + this.toDate
            }
            this.showPopup = false
            this.$emit('input', this.model)
        },
        updateTextButton () {
            if (this.selectType === 0) {
                if (this.quickOption) {
                    this.textButton = this.getOptionText(this.quickOption)
                } else {
                    this.textButton = this.$t('timeRange')
                }
            } else {
                this.textButton = this.fromDate + ' --> ' + this.toDate
            }
        },
        getEpoch () {
            let timeRange = null
            if (this.selectType === 0) {
                if (this.quickOption) {
                    timeRange = this.quickOption.range()
                } else {
                    timeRange = {
                        from: 0,
                        to: moment().unix()
                    }
                }
            } else {
                timeRange = {
                    from: moment(this.fromDate).startOf('d').unix(),
                    to: moment(this.toDate).endOf('d').unix()
                }
            }
            return timeRange
        },
        getTimestamp () {
            let timeRange = this.getEpoch()
            return {
                from: timeRange.from * 1000,
                to: timeRange.to * 1000
            }
        },
        getIntervalList () {
            let timeRange = this.getEpoch()
            let diff = timeRange.to - timeRange.from
            let intervalList = this.chartIntervalList
            for (let interval of intervalList) {
                interval.text = '1 ' + this.$t(interval.i18n)
                interval.disabled = diff / interval.second > this.maxChartIntervalListLength || interval.second > diff
            }
            return intervalList
        },
        getPreferInterval (currentIntervalValue) {
            let intervalList = this.getIntervalList()
            let min = intervalList.length
            let max = 0
            for (let i = 0; i < intervalList.length; i++) {
                let interval = intervalList[i]
                if (!interval.disabled) {
                    if (interval.value === currentIntervalValue) {
                        return currentIntervalValue
                    }
                    if (i < min) min = i
                    if (i > max) max = i
                }
            }
            // return middle index of all enable interval
            return intervalList[Math.floor((max + min) / 2)].value
        }
    },
    watch: {
        value: {
            immediate: true,
            handler: function (value) {
                if (typeof value === 'string') {
                    this.model = value
                    if (value.includes('-')) {
                        this.activeTab = 1
                        this.selectType = 1
                        let split = value.split('-->')
                        this.fromDate = split[0].trim()
                        this.toDate = split[1].trim()
                    } else {
                        this.activeTab = 0
                        this.selectType = 0
                        this.quickOption = optionList.find(option => option.value === value)
                    }
                    this.updateTextButton()
                }
            }
        },
        model: 'updateTextButton',
        '$i18n.locale': 'updateTextButton'
    }
}
</script>

<style scoped lang="scss">
    .menu-container {
        background: #fff;
        padding: 5px;
        width: 600px;

        &.mobile {
            width: 100%;
        }
    }

    .option {
        &:hover {
            background: #ffe4e4;
        }

        &.active {
            background: #1976d2;

            a {
                color: #fff;
            }
        }
    }
</style>
