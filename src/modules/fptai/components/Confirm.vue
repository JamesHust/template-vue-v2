<template>
    <v-dialog v-model="show" width="500" persistent no-click-animation>
        <v-card>
            <div class="grey lighten-2 text-capitalize" style="font-size: 18px; padding-left: 12px; height: 48px; line-height: 48px; font-weight: 600">
                {{ $t('confirm') }}
            </div>
            <div class="pa-3" style="font-size: 14px">
                {{ message }}
                <div style="color: red; font-size: 14px; font-style: italic" v-if="messageNotice">
                    <v-icon small color="red">mdi-alert</v-icon>
                    {{messageNotice}}
                </div>
            </div>
            <v-divider></v-divider>
            <v-layout style="padding: 8px 12px" justify-end>
                <v-btn outlined @click="deny" class="btn-custom">
                    {{ $t('cancel') }}
                </v-btn>
                <v-btn color="primary" @click="confirm" class="btn-custom">
                    {{ $t('confirm') }}
                </v-btn>
            </v-layout>
        </v-card>
    </v-dialog>
</template>
<script>

export default {
    name: 'Confirm',
    data () {
        return {
            show: false,
            promise: null,
            message: '',
            messageNotice: ''
        }
    },
    methods: {
        open ({
            message,
            messageNotice
        }) {
            this.message = message
            this.messageNotice = messageNotice || ''
            this.show = true
            return new Promise((resolve, reject) => {
                this.promise = {
                    resolve,
                    reject
                }
            })
        },
        confirm () {
            this.show = false
            this.promise.resolve(true)
        },
        deny () {
            this.show = false
            this.promise.reject(false)
        }
    }
}
</script>
<style lang="scss" scoped>
.btn-custom {
    text-transform: capitalize !important;
    font-weight: 400;
    padding: 5px 16px !important;
    font-size: 14px;
    height: 32px !important;
    margin-left: 8px;
}

::v-deep .v-card-actions {
    padding: 8px 12px !important;
}
</style>
