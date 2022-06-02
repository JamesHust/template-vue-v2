import Vue from 'vue'
import moment from 'moment'
import i18n from '@/plugins/i18n'

const $filters = {
    tc (value, data = {}) {
        return $filters.capitalize(i18n.t(value, data))
    },
    capitalize (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
    },
    capitalizeAll (value) {
        return value.split(' ').map(item => $filters.capitalize(item)).join(' ')
    },
    toCapitalize (str) {
        return $filters.capitalize(str.toLowerCase())
    },
    formatNumber (value, currency = '') {
        // format number 1234567 to 1,234,567
        try {
            return value.toString()
                .replace(/\D/g, '')
                .replace(/\B(?=(\d{3})+(?!\d))/g, currency === 'USD' ? ',' : '.')
        } catch (e) {
            return ''
        }
    },
    formatDateTime (date) {
        if (!date) return null
        // 2019-05-17T08:16:58.310Z"
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
    formatDate (date) {
        if (!date) return null
        // 2019-05-17T08:16:58.310Z"
        return moment(date).format('YYYY-MM-DD')
    },
    formatTime (time) {
        if (!time) return null
        return moment(time).format('HH:mm:ss')
    },
    toHMS (sec) {
        if (!sec) return '0'
        sec = parseInt(sec, 10)
        let hours = Math.floor(sec / 3600)
        let minutes = Math.floor((sec - (hours * 3600)) / 60)
        let seconds = sec - (hours * 3600) - (minutes * 60)
        if (hours < 10) {
            hours = '0' + hours
        }
        if (minutes < 10) {
            minutes = '0' + minutes
        }
        if (seconds < 10) {
            seconds = '0' + seconds
        }
        return hours + ':' + minutes + ':' + seconds
    },
    replaceSpecialCharacters (string, replaceBy) {
        if (!replaceBy) {
            replaceBy = '-'
        }
        string = string.replace(/\W+(?!$)/g, replaceBy).toLowerCase()
        string = string.replace(/\W$/, '').toLowerCase()
        return string
    }
}

// define default filters
Vue.filter('capitalize', $filters.capitalize)
Vue.filter('capitalizeAll', $filters.capitalizeAll)
Vue.filter('toCapitalize', $filters.toCapitalize)
Vue.filter('formatNumber', $filters.formatNumber)
Vue.filter('formatDateTime', $filters.formatDateTime)
Vue.filter('formatDate', $filters.formatDate)
Vue.filter('formatTime', $filters.formatTime)
Vue.filter('toHMS', $filters.toHMS)
Vue.filter('replaceSpecialCharacters', $filters.replaceSpecialCharacters)

Vue.prototype.$filters = $filters
Vue.prototype.$f = $filters

export default $filters
