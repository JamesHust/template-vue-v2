<script>
export default {
    data () {
        return {
            fileName: '',
            file: null
        }
    },
    methods: {
        pickFile () {
            this.$refs.file.click()
        },
        onFilePicked () {
            const files = this.$refs.file.files
            if (files[0] === undefined) {
                return
            }
            this.file = files[0]
            this.fileName = files[0].name
        }
    }
}
</script>
