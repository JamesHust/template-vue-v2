<template>
    <FciDialog :title="$f.tc('constant')" v-model="show">
        <v-form ref="form" v-model="formValid" @submit="submit" class="pa-3">
            <v-text-field
                outlined dense
                :label="$f.tc('name')"
                v-model="model.name"
                :rules="[formRules.ruleRequired]"
                :disabled="isEdit"
            ></v-text-field>
            <v-text-field
                outlined dense
                :label="$f.tc('value')"
                v-model="model.value"
                :rules="[formRules.ruleRequired]"
            ></v-text-field>
            <v-layout justify-end>
                <v-btn color="primary" type="submit">{{ $t('save') }}</v-btn>
            </v-layout>
        </v-form>
    </FciDialog>
</template>

<script>
import DialogEditorMixin from '@/modules/fptai/mixins/DialogEditorMixin'

export default {
    name: 'ProjectConstantEditor',
    mixins: [DialogEditorMixin],
    data () {
        return {
            model: {
                name: '',
                value: ''
            },
            isEdit: false
        }
    },
    methods: {
        onOpen (item) {
            if (item) {
                this.model.name = item.name
                this.model.value = item.value
                this.isEdit = true
            } else {
                this.isEdit = false
                for (let i in this.model) {
                    this.model[i] = ''
                }
            }
            this.clearFormValidation()
        },
        submitValidForm () {
            this.close()
            this.promise.resolve(this.model)
        }
    }
}
</script>

<style scoped lang="scss">

</style>
