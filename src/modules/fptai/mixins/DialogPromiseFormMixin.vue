<script>
import DialogPromiseMixin from '@/modules/fptai/mixins/DialogPromiseMixin'
import FormMixin from '@/modules/fptai/mixins/FormMixin'

export default {
    name: 'DialogPromiseFormMixin',
    extends: DialogPromiseMixin,
    mixins: [FormMixin],
    methods: {
        open () {
            this.clearForm()
            this.show = true
            return new Promise((resolve, reject) => {
                this.promise = { resolve, reject }
            })
        }
    }
}
</script>
