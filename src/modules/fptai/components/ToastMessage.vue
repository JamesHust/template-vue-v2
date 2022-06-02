<template>
    <v-snackbar
        v-model="isShowToastMessage"
        top
        right
        :timeout="5000"
        :color="snackbarColor"
        style="text-align: left;"
        class="snackbar"
    >
        <span v-html="message" class="toast-message-content"></span>
        <v-btn
            color="primary"
            flat
            @click="isShowToastMessage = false"
        >
            <v-icon dark>clear</v-icon>
        </v-btn>
    </v-snackbar>
</template>

<script>
export default {
    name   : 'ToastMessage',
    props  : ['message', 'snackbarColor'],
    data() {
        return {
            isShowToastMessage: false
        }
    },
    methods: {
        showToastMessage() {
            this.isShowToastMessage = true
        }
    }
}
</script>
