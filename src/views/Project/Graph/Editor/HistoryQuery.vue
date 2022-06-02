<template>
    <FciDialog :title="$f.tc('history')" v-model="show" :width="800">
        <div class="HistoryQuery fci-scrollbar pa-3">
            <table>
                <tr v-for="(item, idx) in queryHistory" :key="idx" @click="executeQuery(item)">
                    <td style="width: 90px">{{$f.formatTime(item.timeAccessed)}}</td>
                    <td>{{item.query}}</td>
                </tr>
                <tr v-if="queryHistory.length === 0" class="notice-empty">
                    <td :colspan="2">{{$f.tc('noDataAvailable')}}</td>
                </tr>
            </table>
        </div>
    </FciDialog>
</template>

<script>
import FciDialog from '@/modules/fptai/components/fci/FciDialog'
import { mapState } from 'vuex'
import DialogPromiseFormMixin from '@/modules/fptai/mixins/DialogPromiseFormMixin'

export default {
    name: 'HistoryQuery',
    components: {
        FciDialog
    },
    mixins: [DialogPromiseFormMixin],
    data () {
        return {
            query: ''
        }
    },
    computed: {
        ...mapState({
            queryHistory: state => state.kg.queryHistory
        })
    },
    mounted () {
        this.$store.dispatch(this.$at.kg.GET_RELATION_TYPE_LIST, {
            projectId: this.$route.params.projectId
        })
    },
    methods: {
        onOpen () {
            this.query = ''
        },
        executeQuery (item) {
            this.query = item.query
            this.submitValidForm()
        },
        submitValidForm () {
            this.close()
            this.promise.resolve(this.query)
        }
    }
}
</script>

<style scoped lang="scss">
.HistoryQuery {
    max-height: 488px;
    overflow-y: auto;
}

table {
    width: 100%;
    border-spacing: 0;
    border: 1px solid #F0F0F0;
    border-bottom: none;

    tr {
        height: 40px;

        &:hover {
            background: #E6F4FF;
        }
    }

    tr.notice-empty:hover {
        background: #FFFFFF !important;
    }

    td {
        padding: 8px;
        border-bottom: 1px solid #F0F0F0;
    }
}

.notice-empty {
    height: 40px;
    color: #888A9A;
    text-align: center;
}
</style>
