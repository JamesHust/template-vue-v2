<template>
    <FciDialog :title="$f.tc('entityType')" v-model="show">
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
            <v-radio-group
                outlined dense row
                :label="$f.tc('entityExtractionMethod')"
                v-model="model.extract_method"
            >
                <v-radio
                    v-for="item in extractMethodList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                ></v-radio>
            </v-radio-group>
            <v-layout justify-end>
                <v-btn color="primary" type="submit">{{ $t('save') }}</v-btn>
            </v-layout>
        </v-form>
    </FciDialog>
</template>

<script>
import FciDialog from '@/modules/fptai/components/fci/FciDialog'
import DialogEditorMixin from '@/modules/fptai/mixins/DialogEditorMixin'

export default {
    name: 'EntityTypeEditor',
    components: {
        FciDialog
    },
    mixins: [DialogEditorMixin],
    data () {
        return {
            model: {
                name: '',
                description: '',
                extract_method: 1
            },
            defaultModel: {
                extract_method: 1
            }
        }
    },
    computed: {
        extractMethodList () {
            return [
                {
                    text: this.$f.tc('both'),
                    value: 1
                }, {
                    text: this.$f.tc('exact'),
                    value: 2
                }, {
                    text: this.$f.tc('predictive'),
                    value: 3
                }
            ]
        }
    },
    methods: {}
}
</script>

<style scoped lang="scss">

</style>
