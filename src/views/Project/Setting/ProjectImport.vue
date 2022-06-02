<template>
    <FciDialog :title="$f.tc('importProject')" v-model="show" :width="500">
        <v-form ref="form" v-model="formValid" @submit="submit" class="pa-3">
            <v-file-input
                v-model="file"
                :placeholder="this.$f.tc('selectFileImportProject')"
                prepend-icon=""
                append-icon="mdi-file-import-outline"
                :rules="[formRules.ruleRequired, ruleTypeFile, ruleFormatFile]"
                @change="readDataFile"
                outlined dense
            ></v-file-input>
            <div style="margin-bottom: 30px" v-if="showListCheckbox">
                <v-checkbox
                    hide-details
                    v-model="model.isImportData"
                    :disabled="disableCheckbox.data"
                    :label="this.$f.tc('import') +' '+ this.$t('responses') + ', NLU, ' + this.$t('constant')"
                ></v-checkbox>
                <v-checkbox
                    hide-details
                    v-model="model.isImportGraph"
                    :disabled="disableCheckbox.graph"
                    :label="this.$f.tc('import') +' '+ this.$t('graph') + ` (${this.$f.tc('noticeImportGraphData')})`"
                ></v-checkbox>
            </div>
            <v-layout justify-end>
                <v-btn color="primary" type="submit">{{ $t('import') }}</v-btn>
            </v-layout>
        </v-form>
    </FciDialog>
</template>

<script>
import DialogEditorMixin from '@/modules/fptai/mixins/DialogEditorMixin'
import lodash from 'lodash'

export default {
    name: 'ProjectImport',
    mixins: [DialogEditorMixin],
    data () {
        return {
            file: null,
            showListCheckbox: false,
            disableCheckbox: {
                data: false,
                graph: false
            },
            model: {
                dataProject: null,
                isImportData: false,
                isImportGraph: false
            }
        }
    },
    computed: {
        ruleFormatFile () {
            if (this.file) {
                return this.showListCheckbox || window.vueapp.$t('formRules.dataOfFileNotCorrect')
            } else {
                return true
            }
        }
    },
    methods: {
        onOpen () {
            this.file = null
            this.refreshSelectCheckbox()
            this.clearForm()
        },
        submitValidForm () {
            const reader = new FileReader()
            reader.onload = (res) => {
                this.model.dataProject = JSON.parse(res.target.result)
                this.close()
                this.promise.resolve(this.model)
            }
            reader.readAsText(this.file)
        },
        ruleTypeFile (file) {
            let result = true
            if (file) {
                const type = file.type
                if (type !== 'application/json') {
                    result = false
                }
            }
            return result || window.vueapp.$t('formRules.onlyJSONFile')
        },
        readDataFile () {
            if (this.file) {
                const reader = new FileReader()
                reader.onload = (res) => {
                    if (!lodash.isEqual(this.model.dataProject, JSON.parse(res.target.result))) {
                        this.model.dataProject = JSON.parse(res.target.result)
                        const keyData = Object.keys(this.model.dataProject)
                        this.model.isImportData = keyData.includes('responses') && keyData.includes('nlp') && keyData.includes('constants')
                        this.disableCheckbox.data = !this.model.isImportData
                        this.model.isImportGraph = keyData.includes('graph')
                        this.disableCheckbox.graph = !this.model.isImportGraph
                        this.showListCheckbox = this.model.isImportData || this.model.isImportGraph
                    }
                }
                reader.readAsText(this.file)
            }
        },
        refreshSelectCheckbox () {
            this.showListCheckbox = false
            this.model.isImportData = false
            this.model.isImportGraph = false
        }
    },
    watch: {
        file () {
            if (!this.file) {
                this.model.dataProject = null
                this.refreshSelectCheckbox()
            }
        }
    }
}
</script>

<style scoped lang="scss">

::v-deep .v-input--selection-controls {
    margin-top: 4px !important;
}
</style>
