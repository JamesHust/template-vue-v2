<template>
    <FciDialog v-model="show" :title="title" :width="width">
        <div class="pa-3">
            <CodeEditor v-model="content" :lineNumbers="true" :height="250" :readonly="true"></CodeEditor>
        </div>
    </FciDialog>
</template>

<script>
import FciDialog from '@/modules/fptai/components/fci/FciDialog'
import DialogPromiseMixin from '@/modules/fptai/mixins/DialogPromiseMixin'
import CodeEditor from '@/modules/fptai/components/CodeEditor'

export default {
    name: 'CodeViewer',
    components: { CodeEditor, FciDialog },
    mixins: [DialogPromiseMixin],
    data () {
        return {
            maxLength: 0,
            title: '',
            width: 500,
            content: ''
        }
    },
    methods: {
        open ({
            title,
            width,
            content
        }) {
            this.title = title || this.$f.tc('name')
            this.content = content || ''
            this.width = width || 500
            this.show = true
            return new Promise((resolve, reject) => {
                this.promise = {
                    resolve,
                    reject
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
::v-deep .v-input__slot {
  border: 1px dashed #0052cc !important;

  & fieldset {
    color: transparent !important;
  }
}

::v-deep .theme--light.v-input--is-disabled textarea {
  color: #262626 !important;
  font-size: 14px;
}

::v-deep .v-textarea.v-text-field--enclosed.v-text-field--outlined:not(.v-input--dense) textarea {
  margin-top: 4px !important;
}
</style>
