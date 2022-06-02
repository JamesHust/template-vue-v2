<template>
    <v-app-bar class="app-header" app fixed clipped-left color="primary">
        <v-layout align-center justify-space-between row>
            <v-btn @click="toggleNavigation" color="fff" icon class="my-0 ml-0" v-if="this.$route.params.projectId">
                <v-icon color="white">menu</v-icon>
            </v-btn>
            <img
                src="/img/fpt_logo_2.svg"
                alt="avatar"
                @click="redirectTo"
                class="logo ml-4"
                v-if="!$ut.isMobile()"
            >
            <span class="app-name" :class="{mobile: $ut.isMobile()}" @click="redirectTo('/')">
                {{ systemName }}
            </span>
            <div class="d-flex align-center" style="color: #FFFFFF; font-size: 14px">
                <v-switch
                        v-model="modeProject"
                        inset hide-details
                        color="white"
                        style="margin-left: 20px; transform: scale(0.85)"
                ></v-switch>
                {{modeProject ? $f.tc('project') : $f.tc('projectTemplate')}}
            </div>
            <div style="flex: 1">
                <router-view name="AppToolbar"></router-view>
            </div>
            <ProjectSelector style="margin-right: 20px"></ProjectSelector>
            <LanguageSelector
                :style="{marginRight: $ut.isMobile() ? '15px' : '70px'}"
            ></LanguageSelector>
            <UserMenu></UserMenu>
        </v-layout>
    </v-app-bar>
</template>
<script>
import UserMenu from '../modules/fptai/components/UserMenu.vue'
import LanguageSelector from '@/modules/fptai/components/LanguageSelector'
import ProjectSelector from '@/components/ProjectSelector'
import { mapState } from 'vuex'

export default {
    name: 'AppToolbar',
    components: {
        ProjectSelector,
        LanguageSelector,
        UserMenu
    },
    data () {
        return {
            systemName: process.env.VUE_APP_SYSTEM_NAME,
            modeProject: true
        }
    },
    created () {
        if (this.$store.getters.token) {
            this.$store.dispatch(this.$actionTypes.user.GET_PROFILE)
        }
    },
    computed: {
        ...mapState({
            mode: state => state.mode
        })
    },
    mounted () {
        this.modeProject = (this.mode === 'projects')
    },
    methods: {
        redirectTo () {
            if (this.$route.path === `/${this.mode}`) {
                this.$router.go()
            } else this.$router.push(`/${this.mode}`)
        },
        toggleNavigation () {
            this.$store.dispatch(this.$actionTypes.TOGGLE_NAVIGATION)
        }
    },
    watch: {
        modeProject () {
            let mode = this.modeProject ? 'projects' : 'project-templates'
            this.$store.dispatch(this.$actionTypes.MODE, mode)
            if (this.$route.path !== `/${mode}`) {
                this.$router.push(`/${mode}`)
            }
        }
    }
}
</script>
<style scoped lang="scss">
.app-name {
    font-size: 23px;
    font-weight: bold;
    color: #fff;
    margin-top: 25px;
    cursor: pointer;

    &.mobile {
        margin-top: 0;
    }
}

.logo {
    width: 110px;
    height: 40px;
    cursor: pointer;
}

//.app-header {
    //background: transparent linear-gradient(90deg, #0052CC 0%, #317CED 85%, #0052CC 100%) 0 0 no-repeat padding-box;
//}

::v-deep .v-input--selection-controls__input {
  margin-right: 0 !important;
}
</style>
