<template>
    <v-dialog
        v-model="show"
        @input="v => v || onModalClose()"
        width="500"
    >
        <v-card class="pa-3">
            {{ message }}
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    name: 'Inform',
    data () {
        return {
            show: false,
            message: '',
            onClose: null
        }
    },
    methods: {
        onModalClose () {
            if (this.onClose) {
                this.onClose()
            }
        },
        open (data) {
            this.message = data.message || ''
            let options = data.options
            if (options) {
                this.onClose = options.onClose
            }
            this.show = true
        },
        close () {
            this.show = false
        }
    }
}
</script>
