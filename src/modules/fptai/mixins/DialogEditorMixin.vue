<script>
import DialogPromiseFormMixin from '@/modules/fptai/mixins/DialogPromiseFormMixin'
import FciDialog from '../components/fci/FciDialog'

const EditorMode = {
    ADD: 'ADD',
    EDIT: 'EDIT'
}

export default {
    name: 'DialogEditorMixin',
    extends: DialogPromiseFormMixin,
    components: { FciDialog },
    data () {
        return {
            EditorMode,
            item: null,
            editorMode: EditorMode.ADD,
            model: {},
            defaultModel: {}
        }
    },
    methods: {
        open (item) {
            this.show = true
            this.item = item
            this.editorMode = this.item ? EditorMode.EDIT : EditorMode.ADD
            this.onOpen(item)
            return new Promise((resolve, reject) => {
                this.promise = {
                    resolve,
                    reject
                }
            })
        },
        onOpen (item) {
            if (item) {
                for (let i in this.model) {
                    this.model[i] = item[i]
                }
            } else {
                if (this.defaultModel) {
                    for (let i in this.model) {
                        if (Array.isArray(this.defaultModel[i])) {
                            this.model[i] = this.$ut.cloneObject(this.defaultModel[i])
                        } else {
                            this.model[i] = this.defaultModel[i] || ''
                        }
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
