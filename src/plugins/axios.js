import axios from 'axios'
import Vue from 'vue'
import Cookies from 'js-cookie'
import $const from '@/utils/const'
import { actionTypes } from '@/store/store.type'
import store from '@/store/store'
import AppService from '@/services/app.service'

const $http = axios.create({
    baseURL: `${process.env.VUE_APP_BASE_API_URL}`
})
$http.interceptors.request.use(
    config => {
        config.headers = {
            Authorization: `Bearer ${Cookies.get($const.TOKEN_KEY)}`,
            ...config.headers
        }
        return config
    },
    err => Promise.reject(err)
)
$http.interceptors.response.use(
    response => response,
    error => {
        let response = error.response
        if (!response) {
            return Promise.reject(error)
        }
        if (response.status === 401) {
            Cookies.remove($const.TOKEN_KEY)
            store.dispatch(actionTypes.user.SIGN_IN, window.location.href)
        } else if (response.status === 403) {
            window.vueapp.$router.push('/access-denied')
        } else if (response.status === 404) {
            AppService.toastError('Api does not exist')
        } else {
            if (typeof response.data === 'string') {
                AppService.toastError(response.data)
            } else if (typeof response.data === 'object') {
                if (response.data.message) {
                    AppService.toastError(response.data.message)
                } else {
                    AppService.toastError(JSON.stringify(response.data))
                }
            }
        }
        return Promise.reject(error)
    }
)
window.$http = $http
Vue.prototype.$http = $http
export default $http
