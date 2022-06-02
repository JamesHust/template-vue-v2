<template>
    <v-layout class="bg">
        <v-flex xs6 class="bg-left">
            <v-layout justify-center align-center class="logo-container">
                <img src="/img/fpt_logo.png" alt="logo">
            </v-layout>
            <div class="wave-container">
                <img src="/img/white-wave.png" alt="wave" class="wave">
            </div>
        </v-flex>
        <v-flex xs6>
            <v-form @submit.prevent="submit" v-model="formValid" ref="form">
                <v-layout align-center style="height: 100vh">
                    <div class="form-container">
                        <div class="platform-name">{{ systemName }}</div>
                        <div class="welcome-text my-3">Welcome back! Please sign in to your account</div>
                        <v-text-field
                            label="Email"
                            type="email"
                            v-model="email"
                            :rules="formRules.email"
                        ></v-text-field>
                        <v-text-field
                            v-model="password"
                            label="Password"
                            type="password"
                            :rules="formRules.required"
                        ></v-text-field>
                        <v-layout justify-center class="mt-3">
                            <v-btn color="primary" type="submit" class="mr-1">
                                Sign in
                            </v-btn>
                        </v-layout>
                    </div>
                </v-layout>
            </v-form>
        </v-flex>
    </v-layout>
</template>

<script>
import AuthService from '@/services/auth.service'
import FormMixin from '@/modules/fptai/mixins/FormMixin'
import { actionTypes } from '@/store/store.type'

export default {
    name: 'AuthenticationSelf',
    mixins: [FormMixin],
    data () {
        return {
            show: true,
            formValid: false,
            email: '',
            password: '',
            systemName: process.env.VUE_APP_SYSTEM_NAME ? process.env.VUE_APP_SYSTEM_NAME : 'Sign in'
        }
    },
    mounted () {
        this.$appService.hideLoading()
    },
    methods: {
        submit () {
            if (this.formValid) {
                AuthService.signInSelfToken(this.email, this.password).then(
                    async result => {
                        this.$store.commit(actionTypes.user.TOKEN, result.data.access)
                        await this.$store.dispatch(
                            this.$actionTypes.user.GET_PROFILE
                        )
                        this.$router.push('/')
                    },
                    this.$appService.handleRequestError('error')
                )
            } else {
                this.$refs.form.validate()
            }
        }
    }
}
</script>

<style scoped>
    .bg {
        height: 100vh;
    }

    .bg-left {
        background: linear-gradient(135deg, #3353a2 0%, #3353a2 30%, #31b7b7 100%);
    }

    .logo-container {
        height: 33vh;
        min-height: 100px;
    }

    .wave-container {
        height: 33vh;
        min-height: 100px;
    }

    .wave {
        position: absolute;
        left: 0;
        bottom: 0;
        max-height: 359px;
        opacity: 0.3;
    }

    .form-container {
        max-width: 430px;
        width: 100%;
        margin: 0 auto;
    }

    ::v-deep .v-btn {
        background: linear-gradient(90deg, rgba(51, 83, 162, 1) 0%, rgba(49, 183, 183, 1) 100%);
        color: #fff;
        border-radius: 5px;
        min-width: 180px;
        height: 48px;
        font-weight: normal;
    }

    .platform-name {
        color: #43425D;
        font-weight: 700 !important;
        text-transform: uppercase;
        text-align: center;
        font-size: 53px;
    }

    .welcome-text {
        color: #a6a7ad;
        text-align: center;
    }
</style>
