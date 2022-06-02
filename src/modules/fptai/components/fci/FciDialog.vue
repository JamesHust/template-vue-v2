<template>
    <v-dialog v-model="value" :max-width="width" persistent no-click-animation class="FciDialog">
        <v-card style="border-radius: 0">
            <v-layout align-center style="background: #0000001a; padding: 8px 12px">
                <div class="title" style="color: #262626; font-size: 18px !important; font-weight: 600">{{ title }}</div>
                <v-spacer></v-spacer>
                <v-btn small icon @click="close">
                    <v-icon color="black">mdi-close</v-icon>
                </v-btn>
            </v-layout>
            <slot></slot>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'FciDialog',
    props: {
        title: String,
        value: Boolean,
        width: {
            type: Number,
            default: 700
        }
    },
    methods: {
        close () {
            this.$emit('input', false)
        }
    }
}
</script>

<style scoped lang="scss">

</style>
