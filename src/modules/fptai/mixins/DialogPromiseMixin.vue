<script>
import DialogMixin from '@/modules/fptai/mixins/DialogMixin'

export default {
    name: 'DialogPromiseMixin',
    extends: DialogMixin,
    data () {
        return {
            promise: null
        }
    },
    methods: {
        open () {
            this.show = true
            return new Promise((resolve, reject) => {
                this.promise = { resolve, reject }
            })
        }
    }
}
</script>
