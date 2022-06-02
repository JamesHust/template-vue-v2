<template>
    <v-menu
        v-model="showPopup"
        :close-on-content-click="false"
        lazy
        transition="scale-transition"
        offset-y
        full-width
    >
        <template v-slot:activator="{ on }">
            <v-text-field
                v-model="time"
                :label="label"
                readonly
                persistent-hint
                v-on="on"
                prepend-inner-icon="mdi-clock"
                :error-messages="errorMessages"
                :clearable="clearable"
                :rules="rules"
            ></v-text-field>
        </template>
        <v-time-picker
            v-model="time"
            show-current
            :min="min"
            :max="max"
            full-width
            format="24hr"
        ></v-time-picker>
    </v-menu>
</template>

<script>
import FormMixin from '@/modules/fptai/mixins/FormMixin'

export default {
    name: 'TimePicker',
    mixins: [FormMixin],
    props: {
        value: String,
        label: String,
        rules: Array,
        min: String,
        max: String,
        errorMessages: String,
        clearable: Boolean,
        required: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            showPopup: false,
            time: this.value
        }
    },
    watch: {
        value (value) {
            this.time = value
        },
        time () {
            this.$emit('input', this.time)
            this.showPopup = false
        }
    }
}
</script>

<style scoped>

</style>
