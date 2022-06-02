<template>
    <div>
        <PrismEditor
                class="code-editor fci-scrollbar"
                v-model="code"
                :style="{'height': height ? ( height + 'px' ) : '100px'}"
                :highlight="highlighter"
                :readonly="readonly"
                :line-numbers="lineNumbers"
        ></PrismEditor>
    </div>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'
import { highlight } from 'prismjs/components/prism-core'
import Prism from 'prismjs'
import 'prismjs/themes/prism.min.css'

export default {
    name: 'CodeEditor',
    components: { PrismEditor },
    props: ['value', 'lineNumbers', 'height', 'readonly'],
    data () {
        return {
            code: ''
        }
    },
    mounted () {
        this.code = this.value
    },
    methods: {
        highlighter (code) {
            return highlight(code, Prism.languages.js, 'js')
        }
    },
    watch: {
        value () {
            this.code = this.value
        },
        code () {
            this.$emit('input', this.code)
        }
    }
}
</script>

<style lang="scss" scoped>
.code-editor {
  background: #ffffff;
  color: #262626;
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 0 12px 0 0;
  border: 1px solid #d4d4d4;
}

::v-deep .prism-editor__line-numbers {
  border-right: 1px solid #d4d4d4;
  padding: 0 10px 0 3px !important;
  background-color: #f2f2f2 !important;
}

::v-deep .prism-editor__container {
  //margin-top: 5px;
}

::v-deep .prism-editor__line-number {
  color: #b2b5cc !important;
}

::v-deep .prism-editor__textarea {
  overflow-x: auto !important;
}

::v-deep .prism-editor__textarea:focus {
  outline: none !important;
}
</style>
