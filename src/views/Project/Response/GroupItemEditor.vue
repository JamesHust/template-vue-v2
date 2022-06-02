<template>
    <FciDialog :title="$f.tc('group')" :width="500" v-model="show" class="ScenarioItemEditor">
        <v-form v-model="formValid" ref="form" @submit="submit">
            <div class="pa-3 fci-scrollbar" style="max-height: 70vh; overflow: auto">
                <!--name-->
                <div class="label">{{ $f.tc('name') }}</div>
                <v-text-field
                    outlined dense
                    v-model="model.name"
                    :rules="[formRules.ruleRequired, ruleDuplicate]"
                ></v-text-field>
                <!--description-->
                <div class="label">{{ $f.tc('description') }}</div>
                <v-textarea outlined rows="2" v-model="model.description"></v-textarea>
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
import DialogEditorMixin from '@/modules/fptai/mixins/DialogEditorMixin'
import FciDialog from '@/modules/fptai/components/fci/FciDialog'
import { mapState } from 'vuex'

const defaultModel = {
    id: '',
    name: '',
    description: ''
}

export default {
    name: 'GroupItemEditor',
    components: { FciDialog },
    mixins: [DialogEditorMixin],
    data () {
        return {
            model: this.$ut.cloneObject(defaultModel)
        }
    },
    computed: {
        ...mapState({
            extraResponseList: state => state.response.extraResponseList
        })
    },
    methods: {
        onOpen (item) {
            if (item) {
                for (let i in this.model) {
                    this.model[i] = item[i] ? item[i] : ''
                }
            } else {
                this.model = this.$ut.cloneObject(defaultModel)
            }
            this.clearFormValidation()
        },
        ruleDuplicate (value) {
            let result = true
            if (value) {
                let extraResponses = this.extraResponseList
                let currentNameGroup = ''
                if (this.model.id) {
                    const checkExist = extraResponses.find(i => i.id === this.model.id)
                    currentNameGroup = checkExist ? checkExist.name : ''
                }
                for (let extraResponse of extraResponses) {
                    if (extraResponse.name === value && extraResponse.name !== currentNameGroup) {
                        result = false
                        break
                    }
                }
            }
            return result || window.vueapp.$t('formRules.fieldDuplicate')
        },
        cancel () {
            this.show = false
            this.promise.reject(false)
        }
    }
}
</script>

<style scoped lang="scss">
.v-select {
    ::v-deep .v-input__slot {
        height: 32px !important;
    }

    ::v-deep .v-text-field__details {
        right: 20px;
    }
}

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

::v-deep textarea {
    line-height: 22px !important;
    font-size: 14px;
    margin-top: 8px !important;
}

::v-deep .v-text-field__details {
    position: absolute;
    right: 0;
    top: 10px;
}

.label {
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 6px;
    margin-top: 12px;

    &:first-child {
        margin-top: 0 !important;
    }
}

.action-footer {
    border-top: 1px solid #D9D9D9;
    padding: 8px 12px;
}

.btn-custom {
    text-transform: inherit !important;
    font-weight: 400;
    padding: 5px 16px !important;
    font-size: 14px;
    height: 32px !important;
}
</style>
