<template>
    <v-snackbar
        v-model="show"
        :timeout="timeout"
        :color="color"
        :top="true"
        :right="true"
        :width="280"
    >
        {{ message }}
        <template v-slot:action="{ attrs }" v-if="!notBtnClose">
            <v-btn
                small icon
                @click="close"
                v-bind="attrs"
            >
                <v-icon size="18" color="white">mdi-close</v-icon>
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
export default {
    name: 'SnackBar',
    data () {
        return {
            message: '',
            show: false,
            timeout: null,
            color: 'red',
            notBtnClose: false
        }
    },
    methods: {
        open ({
            message,
            color,
            timeout,
            notBtnClose
        }) {
            this.message = message
            this.timeout = timeout || 30000
            this.color = color || 'red'
            this.notBtnClose = notBtnClose
            this.show = true
        },
        close () {
            this.show = false
        }
    }
}
</script>

<style scoped lang="scss">
::v-deep .v-snack__content {
    padding: 12px !important;
}

::v-deep .v-snack__action {
    align-self: start !important;
    margin-right: 6px !important;
    margin-top: 8px !important;
}
</style>
