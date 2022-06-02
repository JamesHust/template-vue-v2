<template>
    <FciDialog :title="$f.tc('nlpSample')" v-model="show">
        <v-form class="SampleEditor pa-3" ref="form" v-model="formValid" @submit="submit">
            <v-text-field
                outlined dense
                :label="$f.tc('content')"
                :rules="formRules.required"
                v-model="model.content"
            ></v-text-field>
            <v-autocomplete
                outlined dense
                :label="$f.tc('intent')"
                v-model="model.intent"
                :items="intentList"
                item-text="name"
                item-value="id"
            ></v-autocomplete>
            <v-layout justify-end>
                <v-btn color="primary" type="submit">{{ $t('save') }}</v-btn>
            </v-layout>
        </v-form>
    </FciDialog>
</template>

<script>
import FciDialog from '@/modules/fptai/components/fci/FciDialog'
import DialogEditorMixin from '@/modules/fptai/mixins/DialogEditorMixin'
import { mapState } from 'vuex'

export default {
    name: 'SampleEditor',
    components: {
        FciDialog
    },
    mixins: [DialogEditorMixin],
    data () {
        return {
            model: {
                content: '',
                intent: ''
            }
        }
    },
    computed: {
        ...mapState({
            intentList: state => state.nlp.intentList
        })
    },
    methods: {}
}
</script>

<style scoped lang="scss">

</style>
