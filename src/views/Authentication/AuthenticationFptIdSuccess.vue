<template>
    <div></div>
</template>
<script>
import { mapState } from 'vuex'

export default {
    name: 'AuthenticationFptIdSuccess',
    computed: {
        ...mapState({
            token: state => state.user.token
        })
    },
    mounted () {
        this.$store.dispatch(this.$actionTypes.LOADING, false)
        if (this.$route.query.code) {
            this.$appService.inform(this.$t('signingInNotice'))
            this.$store.dispatch(
                this.$actionTypes.user.GET_JWT_USER, {
                    code: this.$route.query.code,
                    state: this.$route.query.state,
                    sessionState: this.$route.query.session_state
                }
            ).then(() => {
                this.$appService.closeInform()
                this.$router.replace(('/'))
            }).catch(e => {
                console.log(e)
                this.$appService.closeInform()
                this.$router.replace(('/authentication/failed'))
            })
        } else if (this.token) {
            this.$router.replace(('/'))
        } else {
            this.$store.dispatch(this.$actionTypes.user.SIGN_IN)
        }
    }
}
</script>
