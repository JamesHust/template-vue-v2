<template>
    <input
        type="file"
        ref="input"
        style="display: none"
        @input="onFilePicked"
        :multiple="multiple"
        :accept="accept"
    >
</template>

<script>
export default {
    name: 'FileSelector',
    data () {
        return {
            multiple: false,
            accept: '*',
            promise: null
        }
    },
    methods: {
        open (config = {}) {
            this.accept = config.accept || '*'
            this.multiple = config.multiple || false
            setTimeout(() => {
                this.$refs.input.click()
            })
            return new Promise((resolve, reject) => {
                this.promise = {
                    resolve,
                    reject
                }
            })
        },
        onFilePicked (e) {
            let files = e.target.files
            this.promise.resolve(this.multiple ? files : files[0])
        }
    }
}
</script>
