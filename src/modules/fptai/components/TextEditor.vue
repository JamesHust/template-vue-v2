<template>
    <FciDialog v-model="show" :title="title" :width="width">
        <v-form ref="form" v-model="formValid" @submit="submit" class="TextEditor">
            <div class="pa-3">
                <v-text-field
                    outlined
                    dense
                    :rules="rules"
                    v-model="text"
                    autofocus
                    :counter="maxLength > 0"
                    :maxlength="maxLength > 0 ? maxLength : 1000000"
                ></v-text-field>
            </div>
            <v-layout justify-end class="action-footer">
                <v-btn outlined @click="cancel" class="btn-custom" style="margin-right: 8px">
                    {{ $t('cancel') }}
                </v-btn>
                <v-btn color="primary" class="btn-custom" type="submit">{{ $t('save') }}</v-btn>
            </v-layout>
        </v-form>
    </FciDialog>
</template>

<script>
import FciDialog from '@/modules/fptai/components/fci/FciDialog'
import DialogPromiseFormMixin from '@/modules/fptai/mixins/DialogPromiseFormMixin'
import FormRules from '@/modules/fptai/utils/FormRules'

const defaultRules = [FormRules.ruleRequired]

export default {
    name: 'TextEditor',
    components: { FciDialog },
    mixins: [DialogPromiseFormMixin],
    data () {
        return {
            maxLength: 0,
            title: '',
            text: '',
            rules: [],
            width: 500
        }
    },
    methods: {
        open ({
            text,
            title,
            maxLength,
            rules,
            width
        }) {
            this.title = title || this.$f.tc('name')
            this.text = text
            this.width = width || 500
            this.maxLength = maxLength || 0
            this.rules = rules || defaultRules
            this.clearFormValidation()
            this.show = true
            return new Promise((resolve, reject) => {
                this.promise = {
                    resolve,
                    reject
                }
            })
        },
        submitValidForm () {
            this.close()
            this.promise.resolve(this.text)
        },
        cancel () {
            this.show = false
            this.promise.reject(false)
        }
    }
}
</script>

<style scoped lang="scss">
::v-deep .v-input__slot {
    min-height: 32px !important;
    font-size: 14px;
    margin-bottom: 0 !important;
}

::v-deep .theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state)>.v-input__control>.v-input__slot fieldset {
    color: #D9D9D9 !important;
}

::v-deep .v-text-field__details {
    margin-bottom: 3px !important;
}

::v-deep .v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__append-inner {
    margin-top: 4px !important;
}

::v-deep .v-text-field__details {
    position: absolute;
    right: 0;
    top: 10px;
}

.action-footer {
    border-top: 1px solid #D9D9D9;
    padding: 8px 12px;
}

.btn-custom {
    text-transform: capitalize !important;
    font-weight: 400;
    padding: 5px 16px !important;
    font-size: 14px;
    height: 32px !important;
}
</style>
