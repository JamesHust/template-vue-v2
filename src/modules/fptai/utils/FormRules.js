import moment from 'moment'
import $const from '@/utils/const'

export const ruleRequired = v => (v !== null && v !== undefined && v !== '') || window.vueapp.$t('formRules.fieldRequired')
export const ruleCounter = count => {
    return v => {
        if (v && v.length > count) {
            return window.vueapp.$t('formRules.fieldTooLong', [count])
        }
        return true
    }
}
let regProjectName = new RegExp('^[a-zA-Z\\d._\\- ]+$')
export const ruleProjectName = v => regProjectName.test(v) || window.vueapp.$t('projectNameInvalid')
export const ruleDateTime = dateTime => moment(dateTime).isValid() || window.vueapp.$t('formRules.dateTimeNotCorrect')
export const ruleDate = date =>
    moment(date, this.$const.dateFormat, true).isValid() ||
    window.vueapp.$t('formRules.dateTimeNotCorrect')
export const ruleTime = time => /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(time) || window.vueapp.$t('formRules.timeNotCorrect')
export const ruleNumber = value => /^[0-9]*$/.test(value) || window.vueapp.$t('formRules.numberNotValid')
export const rulePositiveNumber = value => !!(/^[0-9]*$/.test(value) && parseInt(value) > -1) || window.vueapp.$t('formRules.positiveNumberNotValid')
export const ruleKeyFormat = value => /^\w+$/.test(value) || window.vueapp.$t('formRules.formatKeyNotValid')
export const ruleDatePicker = date =>
    moment(date, $const.DATE_FORMAT, true).isValid() ||
    window.vueapp.$t('formRules.dateNotCorrect')
export const rulePhone = v => (
    /^[0-9\-+]{9,15}$/.test(v) ||
    window.vueapp.$t('formRules.fieldNotValid', [this.$filters.capitalize(window.vueapp.$t('phoneNumber'))])
)
export const rulePhoneList = v => {
    if (!v) {
        return window.vueapp.$t('formRules.fieldNotValid', [window.vueapp.$t('phoneNumber')])
    }
    let phoneList = v.split(';')
    for (let phone of phoneList) {
        if (phone && /^[0-9\-+]{10,11}$/.test(phone)) {
            // good phone, continue to next phone
        } else {
            return window.vueapp.$t('formRules.fieldNotValid', [window.vueapp.$t('phoneNumber')])
        }
    }
    return true
}
export const ruleEmail = v => /.+@.+/.test(v) || window.vueapp.$f.tc('formRules.fieldNotValid', [window.vueapp.$t('email')])
export const ruleEmailList = v => {
    if (!v) {
        return window.vueapp.$t('formRules.fieldNotValid', [window.vueapp.$t('email')])
    }
    let emailList = v.split(';')
    for (let email of emailList) {
        if (email && /.+@.+/.test(email)) {
            // good email, continue to next email
        } else {
            return window.vueapp.$t('formRules.fieldNotValid', [window.vueapp.$t('email')])
        }
    }
}
export const ruleMin = min => {
    return v => {
        if (isNaN(v)) {
            return window.vueapp.$t('formRules.notANumber')
        }
        return Number(v) >= min || window.vueapp.$t('formRules.minValue', [min])
    }
}

export const ruleURL = str => {
    let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
    return !!pattern.test(str) || window.vueapp.$t('formRules.url')
}

export const ruleNoHtmlTag = str => {
    if (!str) {
        return true
    }
    if (str.includes('>') || str.includes('<')) {
        return window.vueapp.$t('formRules.noHtmlTag')
    }
    return true
}

export const ruleApiHeader = function (text) {
    let re = /^[A-Za-z0-9_-]*$/
    return re.test(text) || 'header invalid'
}

const FormRules = {
    ruleCounter,
    ruleDate,
    ruleDatePicker,
    ruleDateTime,
    ruleEmail,
    ruleEmailList,
    ruleKeyFormat,
    ruleMin,
    ruleNoHtmlTag,
    ruleNumber,
    rulePhone,
    rulePhoneList,
    rulePositiveNumber,
    ruleProjectName,
    ruleRequired,
    ruleTime,
    ruleURL,
    ruleApiHeader
}

export default FormRules
