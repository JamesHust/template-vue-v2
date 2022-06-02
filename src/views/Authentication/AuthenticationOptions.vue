<template>
    <v-dialog v-model="show" max-width="290" persistent no-click-animation v-if="ready">
        <v-card>
            <v-card-title primary-title class="headline grey lighten-2 px-0 py-2">
                <v-layout row justify-space-between align-center>
                    <div class="ml-3">{{ title }}</div>
                </v-layout>
            </v-card-title>
            <v-card-text>
                <span style="font-size: 14px">Pick your sign in option</span>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="authenticateUsingSelfService">
                    Call Center
                </v-btn>
                <v-btn color="primary" @click="authenticateUsingFptId">
                    FPT ID
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import AuthService from '@/services/auth.service'

export default {
    name: 'AuthenticationOptions',
    data () {
        return {
            show: true,
            title: 'Sign in',
            ready: false
        }
    },
    created () {
        if (this.$const.AuthenticationService[this.$store.state.authenticationService]) {
            AuthService.signIn()
        } else {
            this.ready = true
        }
    },
    methods: {
        authenticateUsingSelfService () {
            AuthService.signInSelf()
        },
        authenticateUsingFptId () {
            AuthService.signInFptId()
        }
    }
}
</script>

<style scoped>

</style>
