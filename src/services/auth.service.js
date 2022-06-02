import Cookies from 'js-cookie'
import axios from 'axios'
import router from '@/router/router'
import $const from '@/utils/const'
import store from '@/store/store'
import $http from '@/plugins/axios'
import { actionTypes } from '@/store/store.type'
import $utils from '@/utils/utils'

const TokenKey = 'jwToken'
const RefreshToken = 'refreshToken'

const AuthService = {
    getToken () {
        return Cookies.get(TokenKey)
    },
    setToken (token) {
        return Cookies.set(TokenKey, token)
    },
    removeToken () {
        return Cookies.remove(TokenKey)
    },
    getRefreshToken () {
        return Cookies.get(RefreshToken)
    },
    setRefreshToken (token) {
        return Cookies.set(RefreshToken, token)
    },
    // all in one authenticate function for easy use
    signIn () {
        switch (store.state.authenticationService) {
            case $const.AuthenticationService.SELF:
                this.signInSelf()
                break
            case $const.AuthenticationService.FPT_ID:
                this.signInFptId()
                break
            default:
                router.push('/authentication')
        }
    },
    signOut () {
        switch (store.state.authenticationService) {
            case $const.AuthenticationService.SELF:
                this.signOutSelf()
                break
            case $const.AuthenticationService.FPT_ID:
                this.signOutFptId()
                break
            default:
                router.push('/authentication')
        }
    },
    // authenticate self service
    signInSelf () {
        router.push('/authentication/self')
    },
    signInSelfToken (email, password) {
        return axios.post(
            process.env.VUE_APP_BASE_API_V4_URL + '/jwt-auth/token/',
            {
                email,
                password
            }
        )
    },
    signOutSelf () {
        router.push('/authentication/self')
    },
    // authenticate fpt-id service
    signInFptId () {
        axios.get(process.env.VUE_APP_AUTHORIZATION_BASE + $const.OPEN_ID_CONFIG_PATH).then(result => {
            window.location.href = this.createFptIdUrlParams(result.data.authorization_endpoint)
        })
    },
    signOutFptId () {
        // sign out back-end
        $http.post('/logout/', { refresh_token: this.getRefreshToken() }).finally(() => {
            // sign out front-end
            this.removeToken()
            store.commit(actionTypes.user.TOKEN, {
                token: '',
                refresh: ''
            })
            store.commit(actionTypes.user.PROFILE, {})
            // sign out open id
            axios.get(process.env.VUE_APP_AUTHORIZATION_BASE + $const.OPEN_ID_CONFIG_PATH).then(result => {
                window.location.href = this.createFptIdUrlParams(result.data.end_session_endpoint)
            })
        })
    },
    getAuthenticationSuccessUrl () {
        return `${window.location.origin}/authentication/fpt-id/success/`
    },
    createFptIdUrlParams (url) {
        return $utils.buildUrl({
            url,
            params: {
                client_id: process.env.VUE_APP_AUTHORIZATION_CLIENT_ID,
                redirect_uri: this.getAuthenticationSuccessUrl(),
                state: Math.random().toString(36).substring(2),
                response_type: 'code',
                scope: 'openid+profile+email+phone'
            }
        })
    }
}

export default AuthService
