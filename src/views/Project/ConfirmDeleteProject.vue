<template>
    <FciDialog v-model="show" :title="this.$f.tc('confirm') + ' ' + this.$t('deleteProject')" :width="430">
        <v-form ref="form" v-model="formValid" @submit="submit" class="TextEditor">
            <div class="pa-3" style="font-size: 14px">
                <div>
                    {{ this.$f.tc('thisAction') }} <strong>{{ this.$t('cannot') }}</strong> {{ this.$t('beUndone') }}.
                    {{ this.$f.tc('permanentlyDelete') }} <strong>{{ model.name }}</strong>,
                    {{ this.$f.tc('response') }}, {{ this.$f.tc('intent') }}, {{ this.$f.tc('nlpSample') }},
                    {{ this.$f.tc('entityType') }}.
                </div>
                <div style="margin-top: 12px; margin-bottom: 6px">{{ this.$f.tc('pleaseType') }}
                    <strong>{{ model.name }}</strong> {{ this.$t('toConfirm') }}.
                </div>
                <v-text-field
                    outlined
                    dense
                    autofocus
                    :rules="[formRules.ruleRequired]"
                    v-model="confirmName"
                ></v-text-field>
            </div>
            <v-layout justify-end class="action-footer">
                <v-btn outlined @click="cancel" class="btn-custom" style="margin-right: 8px">
                    {{ $t('cancel') }}
                </v-btn>
                <v-btn color="primary" class="btn-custom" type="submit" :disabled="confirmName !== model.name">{{ $t('delete') }}</v-btn>
            </v-layout>
        </v-form>
    </FciDialog>
</template>

<script>
import FciDialog from '@/modules/fptai/components/fci/FciDialog'
import DialogEditorMixin from '@/modules/fptai/mixins/DialogEditorMixin'

const defaultModel = {
    id: '',
    name: '',
    user: '',
    user_role: ''
}

export default {
    name: 'ConfirmDeleteProject',
    components: { FciDialog },
    mixins: [DialogEditorMixin],
    data () {
        return {
            model: this.$ut.cloneObject(defaultModel),
            confirmName: ''
        }
    },
    methods: {
        onOpen (item) {
            this.clearForm()
            if (item) {
                for (let i in this.model) {
                    this.model[i] = item[i]
                }
            }
            this.clearFormValidation()
        },
        submitValidForm () {
            this.close()
            this.promise.resolve(this.model)
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

::v-deep .theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot fieldset {
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
