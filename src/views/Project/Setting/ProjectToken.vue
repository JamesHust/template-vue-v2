<template>
    <div class="ProjectToken pa-3">
        <v-layout>
            <v-flex xl3 md4 xs12>
                <v-layout>
                    <v-text-field
                        outlined dense hide-details
                        label="OTP"
                        :value="otp"
                        disabled
                    ></v-text-field>
                    <v-btn class="ml-3" @click="copyOTP">{{ $t('copy') }}</v-btn>
                    <v-btn class="ml-3" @click="generateNewOTP">{{ $t('generateNew') }}</v-btn>
                </v-layout>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
import { ProjectService } from '@/services/project.service'

export default {
    name: 'ProjectToken',
    data () {
        return {
            otp: ''
        }
    },
    mounted () {
        this.getCurrentOTP()
    },
    methods: {
        getCurrentOTP () {
            ProjectService.getOTP(this.$route.params.projectId).then(result => {
                this.otp = result.data.otp
            })
        },
        copyOTP () {
            this.$ut.copyToClipboard(this.otp, this.$f.tc('copied'))
        },
        generateNewOTP () {
            ProjectService.generateNewOTP(this.$route.params.projectId).then(result => {
                this.otp = result.data.otp
            })
        }
    }
}
</script>

<style scoped lang="scss">

</style>
