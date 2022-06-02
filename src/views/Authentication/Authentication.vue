<template>
    <div></div>
</template>
<script>
import { mapState } from 'vuex'

export default {
    name: 'Authentication',
    computed: {
        ...mapState({
            token: state => state.user.token,
            projects: state => state.user.projects,
            currentProjectId: state => state.user.currentProjectId
        })
    },
    async mounted () {
        this.$store.dispatch(this.$actionTypes.LOADING, false)
        if (this.$route.query.code) {
            this.$appService.inform(this.$t('signingInNotice'))
            await this.$store.dispatch(this.$actionTypes.user.GET_JWT_USER, this.$route.query.code).then(() => {
                this.$appService.closeInform()
                this.$router.replace(('/'))
            }).catch(e => {
                this.$appService.closeInform()
                console.log(e)
                this.$router.replace(('/authentication-failed'))
            })
        } else if (this.token) {
            this.$router.replace(('/'))
        } else {
            this.$store.dispatch(this.$actionTypes.user.SIGN_IN)
        }
    }
}
</script>
