<template>
    <v-container fluid>
        <v-layout class="mb-3" align-center>
            <div class="display-1">{{ modelName | capitalize }}</div>
            <v-btn icon @click="refresh">
                <v-icon>mdi-refresh</v-icon>
            </v-btn>
        </v-layout>
        <FciDataTable
            :headers="headers"
            :items="items"
            :pagination.sync="pagination"
            @row-click="selectItem($event)"
        >
            <template v-slot:action="props">
                <v-btn icon small @click.stop="deleteItem(props.item)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </template>
        </FciDataTable>
    </v-container>
</template>

<script>
import FciDataTable from '@/modules/fptai/components/fci/FciDataTable'

export default {
    name: 'ListViewMixin',
    components: { FciDataTable },
    data () {
        return {
            items: [],
            pagination: {
                page: 1,
                pageSize: 10
            },
            remotePageSize: -1,
            searchKey: '',
            filter: {},
            itemService: null
        }
    },
    computed: {
        modelName () {
            return 'ListViewMixin'
        },
        headers () {
            return []
        }
    },
    mounted () {
        this.refresh()
    },
    methods: {
        refresh () {
            if (this.remotePageSize < 0) {
                // no remote pagination
                this.itemService.search(this.$route.params.projectId).then(result => {
                    this.items = result.data
                })
            } else {
                // remote pagination
                this.itemService.search(this.$route.params.projectId, {
                    ...this.pagination,
                    ...this.filter,
                    search: this.searchKey
                }).then(result => {
                    this.items = result.data.data
                    this.remotePageSize = result.data.count
                })
            }
        },
        selectItem (item) {
            let slash = this.$route.path.endsWith('/') ? '' : '/'
            this.$router.push(this.$route.path + slash + item.id)
        },
        createItem () {
            this.$refs.ItemEditor.open().then(model => {
                this.itemService.create(this.$route.params.projectId, model).then(() => {
                    this.refresh()
                })
            })
        },
        editItem (item) {
            this.$refs.ItemEditor.open(item).then(model => {
                this.itemService.update(this.$route.params.projectId, item.id, model).then(() => {
                    this.refresh()
                })
            })
        },
        deleteItem (item) {
            this.$appService.confirm(this.$f.tc('confirmDelete', { item: item.name ? item.name : item.content })).then(confirm => {
                if (confirm) {
                    this.itemService.delete(this.$route.params.projectId, item.id).then(() => {
                        this.refresh()
                    })
                }
            })
        },
        runFilter () {
            if (this.pagination.page === 1) {
                this.refresh()
            } else {
                this.pagination = {
                    page: 1,
                    pageSize: this.pagination.pageSize
                }
            }
        }
    },
    watch: {
        pagination: {
            immediate: false,
            handler: function (o, n) {
                if (!this.$ut.cov(o, n)) {
                    this.refresh()
                }
            }
        },
        filter: {
            immediate: false,
            deep: true,
            handler: function () {
                this.runFilter()
            }
        }
    }
}
</script>

<style scoped>

</style>
