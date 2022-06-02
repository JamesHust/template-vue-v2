import AuthService from '@/services/auth.service'
import UserService from '@/services/user.service'
import { userActionTypes } from '../../store.type'

const types = userActionTypes

const state = {
    token: AuthService.getToken(),
    refresh_token: AuthService.getRefreshToken(),
    profile: {}
}

const mutations = {
    [types.TOKEN]: (state, { token, refresh }) => {
        state.token = token
        state.refresh_token = refresh
        AuthService.setToken(token)
        AuthService.setRefreshToken(refresh)
    },
    [types.PROFILE]: (state, profile) => {
        state.profile = profile
        state.isProfileLoaded = true
    }
}

const actions = {
    [types.GET_PROFILE] ({ commit }) {
        UserService.getProfile().then(res => {
            commit(types.PROFILE, res.data)
        })
    },
    [types.GET_JWT_USER]: ({ commit }, { code, state, sessionState }) => {
        return new Promise((resolve, reject) => {
            UserService.getJwtUser({ code, state, sessionState }).then(res => {
                commit(types.PROFILE, res.data)
                commit(types.TOKEN, res.data)
                resolve()
            }).catch(err => {
                reject(err)
            })
        })
    },
    [types.RESET_TOKEN] ({ commit }) {
        return new Promise(resolve => {
            commit(types.TOKEN, { token: '', refresh: '' })
            commit(types.PROFILE, {})
            AuthService.removeToken()
            resolve()
        })
    },
    [types.SIGN_IN] () {
        AuthService.signIn()
    },
    [types.SIGN_OUT] () {
        AuthService.signOut()
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
