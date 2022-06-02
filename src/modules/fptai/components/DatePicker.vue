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
                v-model="date"
                :label="label"
                readonly
                persistent-hint
                v-on="on"
                :rules="rules"
                prepend-inner-icon="mdi-calendar"
                :error-messages="errorMessages"
                :clearable="clearable"
            ></v-text-field>
        </template>
        <v-date-picker
            v-model="date"
            no-title
            show-current
            :min="min"
            :max="max"
            ref="VDatePicker"
            style="width: 100%"
        ></v-date-picker>
    </v-menu>
</template>

<script>
import moment from 'moment'
import FormMixin from '@/modules/fptai/mixins/FormMixin'

export default {
    name: 'DatePicker',
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
            date: this.value
        }
    },
    watch: {
        value (value) {
            this.date = value
        },
        date () {
            this.$emit('input', this.date)
            this.showPopup = false
        },
        showPopup: {
            handler: function (val) {
                if (val) {
                    // show view at current value > min value or current month on open date picker
                    this.$nextTick(() => {
                        if (this.value) {
                            this.$refs.VDatePicker.tableDate = moment(this.value).format('YYYY-MM')
                            return
                        }
                        let today = moment().format('YYYY-MM')
                        let viewDay = today
                        if (this.min) {
                            let minDay = moment(this.min)
                            if (minDay.diff(today, 'days') > 0) {
                                viewDay = minDay.format('YYYY-MM')
                            }
                        }
                        this.$refs.VDatePicker.tableDate = viewDay
                    })
                }
            }
        }
    }
}
</script>

<style scoped>

</style>
