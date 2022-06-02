<template>
    <FciDialog :title="$f.tc('intent')" v-model="show">
        <v-form class="IntentEditor pa-3" ref="form" v-model="formValid" @submit="submit">
            <v-text-field
                outlined dense
                :label="$f.tc('name')"
                :rules="formRules.required"
                v-model="model.name"
            ></v-text-field>
            <v-text-field
                outlined dense
                :label="$f.tc('description')"
                v-model="model.description"
            ></v-text-field>
            <IntentSlotEditor ref="IntentSlotEditor"></IntentSlotEditor>
            <v-layout justify-end>
                <v-btn color="primary" type="submit">{{ $t('save') }}</v-btn>
            </v-layout>
        </v-form>
    </FciDialog>
</template>

<script>
import FciDialog from '@/modules/fptai/components/fci/FciDialog'
import DialogEditorMixin from '@/modules/fptai/mixins/DialogEditorMixin'
import IntentSlotEditor from '@/views/Project/NLP/IntentSlotEditor'

export default {
    name: 'IntentEditor',
    components: {
        IntentSlotEditor,
        FciDialog
    },
    mixins: [DialogEditorMixin],
    data () {
        return {
            model: {
                name: '',
                description: '',
                slots: []
            }
        }
    },
    methods: {
        onOpen (item) {
            if (item) {
                for (let i in this.model) {
                    this.model[i] = item[i]
                }
            } else {
                for (let i in this.model) {
                    if (Array.isArray(this.model[i])) {
                        this.model[i] = []
                    } else {
                        this.model[i] = ''
                    }
                }
            }
            if (this.$refs.IntentSlotEditor) {
                this.$refs.IntentSlotEditor.clearInput()
            }
            this.$nextTick(() => {
                this.$refs.IntentSlotEditor.setData(this.model.slots)
            })
            this.clearFormValidation()
        },
        submitValidForm () {
            this.close()
            this.model.slots = this.$refs.IntentSlotEditor.getData()
            this.promise.resolve(this.model)
        }
    }
}
</script>

<style scoped lang="scss">

</style>
