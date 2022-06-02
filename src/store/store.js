import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user/user.store'
import kg from './modules/kg/kg.store'
import nlp from './modules/nlp/nlp.store'
import response from './modules/response/response.store'
import { actionTypes } from './store.type'
import $const from '@/utils/const'
import { ProjectService } from '@/services/project.service'
import { ProjectTemplateService } from '@/services/template.service'

let types = actionTypes

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        isShowLoading: false,
        navigation: false,
        mode: 'projects',
        version: '0.1',
        authenticationService:
            process.env.VUE_APP_AUTHENTICATION_SERVICE ||
            $const.AuthenticationService.FPT_ID,
        windowResized: null, // resize event
        project: null,
        projectList: []
    },
    mutations: {
        [types.LOADING]: (state, payload) => {
            state.isShowLoading = payload
        },
        [types.TOGGLE_NAVIGATION]: (state) => {
            state.navigation = !state.navigation
        },
        [types.MODE]: (state, payload) => {
            state.mode = payload
        },
        [types.NAVIGATION] (state, val) {
            state.navigation = val
        },
        [types.PROJECT] (state, val) {
            state.project = val
        },
        [types.PROJECT_LIST] (state, val) {
            state.projectList = val
        }
    },
    actions: {
        [types.LOADING]: (context, payload) => {
            context.commit(types.LOADING, payload)
        },
        [types.TOGGLE_NAVIGATION]: (context) => {
            context.commit(types.TOGGLE_NAVIGATION)
        },
        [types.NAVIGATION] (context, payload) {
            context.commit(types.NAVIGATION, payload)
        },
        [types.MODE] (context, payload) {
            context.commit(types.MODE, payload)
        },
        [types.PROJECT] (context, payload) {
            context.commit(types.PROJECT, payload)
        },
        [types.GET_PROJECT_LIST] (context) {
            switch (this.state.mode) {
                case 'projects':
                    return ProjectService.search().then(result => {
                        context.commit(types.PROJECT_LIST, result.data)
                        return result.data
                    })
                case 'project-templates':
                    return ProjectTemplateService.search().then(result => {
                        context.commit(types.PROJECT_LIST, result.data)
                        return result.data
                    })
            }
        }
    },
    modules: {
        user,
        kg,
        nlp,
        response
    },
    getters: {
        loading: state => state.isShowLoading,
        profile: state => state.user.profile,
        token: state => state.user.token,
        version: state => state.version
    }
})

export default store
