<template>
    <FciDialog :title="$f.tc('exportProject')" v-model="show" :width="500">
        <v-form ref="form" v-model="formValid" @submit="submit" class="pa-3">
            <div style="margin-bottom: 30px">
                <v-checkbox
                    hide-details
                    v-model="model.isExportData"
                    :label="this.$f.tc('export') + ' ' + this.$t('responses') + ', NLU, ' + this.$t('constant')"
                ></v-checkbox>
                <v-checkbox
                    hide-details
                    v-model="model.isExportGraph"
                    :label="this.$f.tc('export') +' '+ this.$t('graph')"
                ></v-checkbox>
            </div>
            <v-layout justify-end>
                <v-btn color="primary" type="submit">{{ $t('export') }}</v-btn>
            </v-layout>
        </v-form>
    </FciDialog>
</template>

<script>
import DialogEditorMixin from '@/modules/fptai/mixins/DialogEditorMixin'

export default {
    name: 'ProjectExport',
    mixins: [DialogEditorMixin],
    data () {
        return {
            model: {
                isExportData: true,
                isExportGraph: true
            }
        }
    },
    methods: {
        onOpen () {
            this.model.isExportData = true
            this.model.isExportGraph = true
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
