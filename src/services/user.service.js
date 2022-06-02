import axios from 'axios'
import AuthService from '@/services/auth.service'

const UserService = {
    getJwtUser ({
        code,
        state,
        sessionState
    }) {
        let url = process.env.VUE_APP_BASE_API_URL + '/social/jwt_user/fpt_id/'
        let instance = axios.create({
            headers: {
                common: {
                    'Content-Type': 'application/json'
                }
            }
        })
        return instance.post(url, {
            code,
            state,
            session_state: sessionState,
            redirect_uri: AuthService.getAuthenticationSuccessUrl()
        })
    },
    getProfile () {
        return window.$http.get('/profile/')
    }
}

export default UserService
