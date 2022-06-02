<template>
    <div class="FciDataTable">
        <table>
            <thead>
            <tr>
                <th v-for="(header, i) in headers" :key="i">
                    {{ header.text }}
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, itemIndex) in displayItems" :key="itemIndex" @click="indexRowActived = itemIndex"
                :style="[itemIndex === indexRowActived ? { 'background': '#E6F4FF' } : '']">
                <td v-for="(header, headerIndex) in headers" :key="headerIndex">
                    <template v-if="$scopedSlots[header.id || header.value]">
                        <slot
                                :name="header.id || header.value"
                                :item="item"
                                :index="itemIndex"
                                :pagingIndex="(paginationInner.page - 1) * paginationInner.pageSize + itemIndex"
                        ></slot>
                    </template>
                    <template v-else>
                        {{ getValue(header, item, itemIndex) }}
                    </template>
                </td>
            </tr>
            <template v-if="displayItems.length === 0">
                <tr>
                    <td :colspan="headers.length" class="notice-empty">{{ $f.tc('noDataAvailable') }}</td>
                </tr>
            </template>
            <template v-if="displayItems.length < paginationInner.pageSize && showEmptyRows">
                <tr v-for="i in emptyRowsCount" :key="'e' + i">
                    <td :colspan="headers.length"></td>
                </tr>
            </template>
            </tbody>
        </table>
        <div class="FciDataTable-footer">
            <div style="color: #8C8C8C" class="mr-3">{{ $f.tc('rowsPerPage') }}</div>
            <v-menu offset-y>
                <template v-slot:activator="{on}">
                    <div class="page-size-container" v-on="on">
                        {{ paginationInner.pageSize }}
                        <v-icon>mdi-chevron-down</v-icon>
                    </div>
                </template>
                <div class="fci-list" style="background: #fff; font-size: 14px !important;">
                    <div class="fci-list-item" v-for="item in pageSizeList" :key="item" @click="changePageSize(item)">
                        {{ item }}
                    </div>
                </div>
            </v-menu>
            <v-spacer></v-spacer>
            <v-pagination
                    v-model="paginationInner.page"
                    :length="pageCount"
                    :total-visible="7"
            ></v-pagination>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FciDataTable',
    props: {
        items: {
            type: Array,
            default: () => []
        },
        headers: Array,
        pageSizeList: {
            type: Array,
            default: () => [5, 10, 15, 20, 25, 30]
        },
        pagination: Object,
        remotePageSize: Number,
        showEmptyRows: Boolean
    },
    data () {
        return {
            isRemotePaging: typeof this.remotePageSize === 'number' || this.remotePageSize >= 0,
            displayItems: [],
            paginationInner: {
                count: 1,
                page: 1,
                pageSize: 10
            },
            indexRowActived: null
        }
    },
    computed: {
        pageCount () {
            return Math.ceil(this.paginationInner.count / this.paginationInner.pageSize)
        },
        emptyRowsCount () {
            let result = this.paginationInner.pageSize - this.displayItems.length
            if (this.displayItems.length === 0) result -= 1
            return result
        }
    },
    methods: {
        /**
         * @param {{value:string}} header
         * @param {{$value:function}} header
         * @param item
         * @param itemIndex
         */
        getValue (header, item, itemIndex) {
            return typeof header.$value === 'function'
                ? header.$value(item, (this.page - 1) * this.pageSize + itemIndex)
                : item[header.value]
        },
        changePageSize (pageSize) {
            this.paginationInner.pageSize = pageSize
            this.paginationInner.page = 1
        },
        createDisplayItems () {
            if (this.isRemotePaging) {
                this.displayItems = this.items
                return
            }
            this.displayItems = []
            let start = (this.paginationInner.page - 1) * this.paginationInner.pageSize
            if (start >= this.items.length) {
                start = 0
            }
            let end = start + this.paginationInner.pageSize
            for (let i = start; i < end; i++) {
                if (i < this.items.length) {
                    this.displayItems.push(this.items[i])
                }
            }
            this.$forceUpdate()
        },
        updatePaging () {
            if (this.isRemotePaging) {
                this.paginationInner.count = this.remotePageSize
            } else {
                this.paginationInner.count = this.items.length
            }
            this.createDisplayItems()
        }
    },
    watch: {
        pagination: {
            immediate: true,
            deep: true,
            handler: function () {
                if (this.pagination) {
                    Object.assign(this.paginationInner, this.pagination)
                }
            }
        },
        paginationInner: {
            deep: true,
            handler: function () {
                if (!this.isRemotePaging) {
                    this.createDisplayItems()
                }
                if (JSON.stringify(this.paginationInner) !== JSON.stringify(this.pagination)) {
                    this.$emit('update:pagination', {
                        page: this.paginationInner.page,
                        pageSize: this.paginationInner.pageSize
                    })
                }
            }
        },
        items: {
            immediate: true,
            handler: function () {
                this.updatePaging()
            }
        }
    }
}
</script>

<style scoped lang="scss">
.FciDataTable {
  border: 1px solid #D9D9D9;
  overflow: hidden;
  font-size: 14px;
}

table {
  border-collapse: collapse;
  width: 100%;

  th {
    background: #F0F0F0;
    height: 48px;
    padding: 0 12px;
    text-align: left;
    text-transform: capitalize;

    &:last-child {
      text-align: center !important;
    }
  }

  td {
    border-top: 1px solid #D9D9D9;
    height: 48px;
    padding: 0 12px;

    &:last-child {
      text-align: center !important;
    }
  }

  tr:nth-child(even) td {
    //background: #F2F4FA;
  }
}

.notice-empty {
  height: 43px;
  color: #888A9A;
  text-align: center;
}

.FciDataTable ::v-deep .v-pagination button {
  box-shadow: none;
  color: #8C8C8C;
  padding: 0 5px;
  min-width: 26px;
  height: 26px;
  margin: 0 7px;
  user-select: none;

  &:focus {
    outline: none;
  }

  &.v-pagination__item--active {
    background-color: #F0F0F0 !important;
    font-weight: bold;
    color: #262626;
  }
}

.FciDataTable-footer {
  border-top: 1px solid #D6D9E6;
  height: 48px;
  padding-left: 12px;
  display: flex;
  align-items: center;
}

.page-size-container {
  color: #262626;
  cursor: pointer;
  padding: 0 5px;
  border-radius: 5px;
  height: 26px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #F0F0F0;
  }
}
</style>
