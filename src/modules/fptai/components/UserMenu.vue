<template>
    <div class="UserMenu">
        <div id="user-menu" class="centerY on-toolbar">
            <div v-if="appUtils.isNotMobile()" class="mr-2">
                 <div class="mb-1" style="text-align: right">{{ $t('hello') | capitalize }},</div>
                 <div class="user-name">{{ profile.name }}</div>
             </div>
            <div class="mr-2">
                <v-btn text icon class="user-icon">
                    <v-icon color="#fff">person</v-icon>
                </v-btn>
            </div>
        </div>
        <v-menu v-if="token && profile" :close-on-content-click="true" offset-y activator="#user-menu">
            <v-card>
                <v-list>
                    <v-list-item>
                        <v-list-item-avatar>
                            <v-icon size="30">person</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title class="user-name">{{ profile.name }}</v-list-item-title>
                            <v-list-item-subtitle>
                                <a :href="openid_url" target="_blank" class="user-link">
                                    {{ profile.email }}
                                </a>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <template v-if="notProduction">
                    <v-divider></v-divider>
                    <table class="my-2 mx-1">
                        <tr>
                            <td>Env</td>
                            <td>{{ appEnv }}</td>
                        </tr>
                        <tr>
                            <td>Version</td>
                            <td>{{ appVersion }}</td>
                        </tr>
                        <tr>
                            <td>Build</td>
                            <td>{{ buildTime }}</td>
                        </tr>
                        <tr>
                            <td>Token Expire</td>
                            <td>{{ tokenExpire }}</td>
                        </tr>
                        <tr>
                            <td>Roles</td>
                            <td>{{ profile.roles }}</td>
                        </tr>
                    </table>
                </template>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="signOut">{{ $t('signOut') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import $utils from '@/utils/utils'
import moment from 'moment'

export default {
    name: 'UserMenu',
    data () {
        return {
            openid_url: '',
            appEnv: process.env.NODE_ENV,
            buildTime: moment(Number(process.env.VUE_APP_BUILD_TIME)).format('HH:mm:ss DD-MM-YYYY'),
            appUtils: this.$utils,
            notProduction: process.env.NODE_ENV !== this.$const.env.PRO
        }
    },
    computed: {
        ...mapState({
            profile: state => state.user.profile,
            token: state => state.user.token,
            appVersion: state => state.version,
            buildVersion: state => state.buildVersion,
            tokenExpire: state => {
                if (state.user.token) {
                    return moment($utils.decodeJWT(state.user.token).exp * 1000).format('HH:mm:ss')
                }
                return 0
            }
        })
    },
    async mounted () {
        this.openid_url = process.env.VUE_APP_OPENID_URL
    },
    methods: {
        signOut () {
            this.$store.dispatch(this.$actionTypes.user.SIGN_OUT)
        }
    }
}
</script>
<style scoped lang="scss">
    .user-name {
        font-weight: bold;
    }

    .user-link {
        color: #649FDF;
        text-decoration: none;
    }

    .UserMenu {
        color: #fff;
        font-size: 14px;
        line-height: 14px;
        cursor: pointer;

        .user-icon {
            background: #d0d0d0;
            margin: 0;
        }

        .on-toolbar {
            .user-name {
                text-transform: uppercase;
            }
        }
    }

    table tr td {
        font-size: 14px;

        &:first-child {
            font-weight: bold;
            padding-right: 10px;
        }
    }
</style>
