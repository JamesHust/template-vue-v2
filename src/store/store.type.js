import Vue from 'vue'
import userActionTypes from './modules/user/user.type'
import kgActionTypes from './modules/kg/kg.type'
import nlpActionTypes from './modules/nlp/nlp.type'
import responseActionTypes from '@/store/modules/response/response.type'
// naming convention
// raw name mean set, LOADING => mean set LOADING

// user store
// const userActionTypesShortcut = { ...userActionTypes }
// Object.keys(userActionTypes).forEach(item => {
//     userActionTypesShortcut[item] = 'user/' + userActionTypes[item]
// })

// knowledge graph
// const kgActionTypesShortcut = { ...kgActionTypes }
// Object.keys(kgActionTypes).forEach(item => {
//     kgActionTypesShortcut[item] = 'kg/' + kgActionTypes[item]
// })

// nlp
// const nlpActionTypesShortcut = { ...nlpActionTypes }
// Object.keys(nlpActionTypes).forEach(item => {
//     nlpActionTypesShortcut[item] = 'nlp/' + nlpActionTypes[item]
// })

// main store
const actionTypes = {
    // common for both action and mutation in main store
    LOADING: 'LOADING',
    TOGGLE_NAVIGATION: 'TOGGLE_NAVIGATION',
    NAVIGATION: 'NAVIGATION',
    MODE: 'MODE',
    TOKEN: 'TOKEN',
    PROJECT: 'PROJECT',
    PROJECT_LIST: 'PROJECT_LIST',
    GET_PROJECT_LIST: 'GET_PROJECT_LIST'
    // user: userActionTypesShortcut,
    // kg: kgActionTypesShortcut,
    // nlp: nlpActionTypesShortcut
}

let shortcutList = [
    {
        prepend: 'user',
        types: userActionTypes
    }, {
        prepend: 'kg',
        types: kgActionTypes
    }, {
        prepend: 'nlp',
        types: nlpActionTypes
    }, {
        prepend: 'response',
        types: responseActionTypes
    }
]
shortcutList.forEach(shortcut => {
    const actionTypesShortcut = { ...shortcut.types }
    Object.keys(actionTypesShortcut).forEach(item => {
        actionTypesShortcut[item] = shortcut.prepend + '/' + actionTypesShortcut[item]
    })
    actionTypes[shortcut.prepend] = actionTypesShortcut
})

Vue.prototype.$actionTypes = actionTypes
Vue.prototype.$at = actionTypes

export {
    userActionTypes,
    actionTypes
}
