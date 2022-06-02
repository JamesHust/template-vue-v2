<template>
    <v-data-table
        :headers="headers"
        :items="items"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="paginationData"
        :total-items="paginationData.totalItems"
        :rows-per-page-text="$t('rowsPerPage')"
        :class="{'data-table-mobile': utils.isMobile(),'elevation-1': utils.isNotMobile()}"
        :no-data-text="$t('noDataAvailable') | capitalize"
        :hide-headers="utils.isMobile()"
        :hide-actions="hideActions"
        :custom-sort="customSort"
    >
        <template v-slot:items="props">
            <tr v-if="utils.isMobile()" @click="onRowClick(props.item)" :class="rowClass">
                <td :colspan="headers.length" class="pa-0">
                    <div class="dtm-cell">
                        <table>
                            <tr v-for="header in headers" :key="header.text">
                                <td><b>{{ header.text }}</b></td>
                                <td>
                                    <template v-if="header.type === 'custom'">
                                    <slot :name="header.id || header.value" :item="props.item"></slot>
                                </template>
                                <template v-else>
                                    {{ getValue(header, props.item, props.index) }}
                                </template>
                                </td>
                            </tr>
                        </table>
                    </div>
                </td>
            </tr>
            <tr v-else
                @click="onRowClick(props.item)"
                :class="rowClass"
                :style="{cursor: $listeners['row-click'] ? 'pointer' : 'normal'}"
            >
                <td
                    v-for="header in headers"
                    :key="header.text"
                    :class="getClass(header, props.item)"
                    :style="getStyle(header, props.item)"
                >
                    <template v-if="header.type === 'custom'">
                        <slot :name="header.id || header.value" :item="props.item"></slot>
                    </template>
                    <template v-else>
                        {{ getValue(header, props.item, props.index) }}
                    </template>
                </td>
            </tr>
        </template>
    </v-data-table>
</template>
<script>

export default {
    name: 'SimpleDataTable',
    props: {
        headers: Array,
        items: Array,
        pagination: Object,
        rowClass: {
            type: String,
            default: ''
        },
        customSort: Function,
        rowsPerPageItems: {
            type: Array,
            default: () => [5, 10, 15, 20, 50]
        },
        hideActions: Boolean
    },
    data () {
        let paginationData = this.pagination ? { ...this.pagination } : {}
        if (!paginationData.page) {
            paginationData.page = 1
        }
        if (!paginationData.rowsPerPage) {
            paginationData.rowsPerPage = this.rowsPerPageItems[0]
        }
        return {
            paginationData: paginationData,
            utils: this.$utils
        }
    },
    methods: {
        onRowClick (rowData) {
            this.$emit('row-click', rowData)
        },
        getValue (header, item, index) {
            return typeof header.$value === 'function' ? header.$value(item, index) : item[header.value]
        },
        getClass (header, item) {
            let className = header.class ? header.class : ''
            className += header.$class ? ' ' + header.$class(item) : ''
            return className
        },
        getStyle (header, item) {
            let style = header.style ? header.style : ''
            style += header.$style ? header.$style(item) : ''
            return style
        }
    },
    watch: {
        pagination (val) {
            for (let i in val) {
                this.paginationData[i] = val[i]
            }
        },
        paginationData (val) {
            this.$emit('update:pagination', val)
        }
    }
}
</script>
<style scoped lang="scss">
    .dtm-cell {
        padding: 10px;
        border-bottom: 5px solid rgba(0, 0, 0, 0.12);
    }

    .dtm-cell table {
        width: 100%;
        border-collapse: collapse;

        td {
            padding: 5px !important;
            height: auto !important;
        }
    }
</style>
