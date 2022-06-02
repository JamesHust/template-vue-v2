<script>
export default {
    name: "AutoRefreshMixin",
    data () {
        return {
            autoRefreshTimeout: null,
            autoRefreshInterval: 0
        }
    },
    computed: {
        autoRefreshIntervalList () {
            return [
                { text: this.$t('off'), value: 0 },
                { text: '10 ' + this.$t('seconds'), value: 10000 },
                { text: '30 ' + this.$t('seconds'), value: 30000 },
                { text: '1 ' + this.$t('minute'), value: 60000 },
                { text: '5 ' + this.$t('minutes'), value: 300000 }
            ]
        }
    },
    mounted () {
        this.refresh()
    },
    destroyed () {
        clearTimeout(this.autoRefreshTimeout)
    },
    methods: {
        refresh () {
            // remember to call startAutoRefresh when promise settled
            this.startAutoRefresh()
        },
        startAutoRefresh () {
            clearTimeout(this.autoRefreshTimeout)
            if (this.autoRefreshInterval !== 0) {
                this.autoRefreshTimeout = setTimeout(this.refresh, this.autoRefreshInterval)
            }
        }
    },
    watch: {
        autoRefreshInterval (autoRefreshInterval) {
            if (autoRefreshInterval !== 0 && !this.autoRefreshTimeout) {
                this.refresh()
            }
        }
    }
}
</script>
