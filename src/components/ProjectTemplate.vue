<template>
    <div class="main-container">
        <AppToolbar></AppToolbar>
        <Navigation v-if="this.$route.params.projectId"></Navigation>
        <v-main>
            <router-view></router-view>
        </v-main>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import AppToolbar from './AppToolbar.vue'
import Navigation from './Navigation'

export default {
    name: 'ProjectTemplate',
    components: {
        AppToolbar,
        Navigation
    },
    computed: {
        ...mapState({
            token: state => state.user.token
        })
    }
}
</script>
<style scoped>
    .active_navigation i, .active_navigation .v-list__tile__title {
        color: #1976d2 !important;
        /*font-weight: bold;*/
    }

    .active_navigation .v-list__tile__title {
        font-weight: bold;
    }

    .main-container {
        background: #f5f5f5;
        min-height: 100%;
    }
</style>
