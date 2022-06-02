<template>
    <FciDialog :title="$f.tc('node')" v-model="show">
        <div class="block mt-2">
            <h4>{{ $f.tc('name') }}</h4>
            <input type="text" class="fci-input spreadX" v-model="model._name">
        </div>
        <div class="block">
            <h4>{{ $f.tc('labels') }}</h4>
            <GraphLabelEditor
                ref="LabelsEditor"
                v-model="model._labels"
            ></GraphLabelEditor>
        </div>
        <div class="block">
            <h4>{{ $f.tc('entityType') }}</h4>
            <input type="text" class="fci-input spreadX" v-model="model._entity_type">
        </div>
        <div class="block">
            <h4>{{ $f.tc('synonyms') }}</h4>
            <GraphLabelEditor
                ref="SynonymsEditor"
                v-model="model._synonyms"
                :validateLabel="false"
            ></GraphLabelEditor>
        </div>
        <v-layout justify-end style="padding: 12px">
            <v-btn color="primary" @click="save">{{ $f.tc('save') }}</v-btn>
        </v-layout>
    </FciDialog>
</template>

<script>
import FciDialog from '@/modules/fptai/components/fci/FciDialog'
import DialogPromiseMixin from '@/modules/fptai/mixins/DialogPromiseMixin'
import GraphLabelEditor from '@/views/Project/Graph/Editor/GraphLabelEditor'

export default {
    name: 'GraphNodeCreator',
    components: {
        GraphLabelEditor,
        FciDialog
    },
    mixins: [DialogPromiseMixin],
    data () {
        return {
            model: {
                _name: '',
                _labels: [],
                _entity_type: '',
                _synonyms: []
            }
        }
    },
    methods: {
        open () {
            // reset dialog
            this.model = {
                _name: '',
                _labels: [],
                _entity_type: '',
                _synonyms: []
            }
            if (this.$refs.LabelsEditor) {
                this.$refs.LabelsEditor.newLabel = ''
            }
            if (this.$refs.SynonymsEditor) {
                this.$refs.SynonymsEditor.newLabel = ''
            }
            this.show = true
            return new Promise((resolve, reject) => {
                this.promise = {
                    resolve,
                    reject
                }
            })
        },
        validateModel () {
            if (!this.model._name) {
                this.$appService.inform(this.$f.tc('propertyNameRequire'))
                return false
            }
            return true
        },
        save () {
            let temp = this.$refs.LabelsEditor.newLabel
            if (temp) {
                this.model._labels.push(temp)
            }
            temp = this.$refs.SynonymsEditor.newLabel
            if (temp) {
                this.model._synonyms.push(temp)
            }
            if (!this.validateModel()) {
                return
            }
            this.close()
            this.promise.resolve(this.model)
        }
    }
}
</script>

<style scoped>
.block {
    padding: 0 12px 12px 12px;
}
</style>
