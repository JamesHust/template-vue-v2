<script>
import { AppEventBus } from '@/eventbus/app.eventbus'

export default {
    name: 'BaseServiceView',
    data () {
        return {
            TypeMap: {}
        }
    },
    mounted () {
        AppEventBus.on('*', this.handleEvent)
    },
    destroyed () {
        AppEventBus.off('*', this.handleEvent)
    },
    methods: {
        handleEvent (type, data) {
            let refName = this.TypeMap[type]
            if (refName) {
                let promise = this.$refs[refName].open(data)
                if (promise) {
                    promise.then(data => {
                        AppEventBus.emit(type + '_DONE', data)
                    })
                }
            }
        }
    }
}
</script>
