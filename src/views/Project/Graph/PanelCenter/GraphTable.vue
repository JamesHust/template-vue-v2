<template>
    <div class="GraphTable fci-scrollbar">
        <table>
            <thead>
            <tr class="cell">
                <th class="cell-header" v-for="(header, i) in headers" :key="i" :style="[header === 'detail' ? {'min-width': '300px'} : '']">
                    {{ header }}
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, i) in items" :key="i" class="cell">
                <template v-if="isMultipleColumn">
                    <td v-for="header in headers" :key="i + '-' + header" class="cell-inner fci-scrollbar">
                        <pre>{{ item[header] }}</pre>
                    </td>
                </template>
                <template v-else>
                    <td class="cell-inner">
                        <pre>{{ item }}</pre>
                    </td>
                </template>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

export default {
    name: 'GraphTable',
    props: ['graphViewId', 'queryData'],
    data () {
        return {
            headers: [],
            items: [],
            cellWidth: 0,
            isMultipleColumn: false
        }
    },
    watch: {
        queryData: {
            immediate: true,
            handler: function () {
                this.items = this.queryData
                if (this.items.length > 0) {
                    this.isMultipleColumn = typeof this.queryData[0] === 'object'
                    if (this.isMultipleColumn) {
                        this.headers = Object.keys(this.queryData[0])
                    } else {
                        this.headers = ['item']
                    }
                } else {
                    this.headers = []
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.GraphTable {
  background: #f5f5f5;
  padding: 1px;
  overflow: auto;
}

.cell {
  //padding: 1px;

  .cell-header {
    font-weight: 600;
    font-size: 14px;
    background: #F0F0F0;
    color: #262626;
    padding: 12px 10px;
  }

  .cell-inner {
    height: 100%;
    background: #fff;
    padding: 12px 10px;
    font-size: 14px;
  }
}

table {
  width: 100%;
  height: 100%;
  border-collapse: collapse;
}

table, td, th {
  border: 1px solid #D9D9D9;
}

pre {
  overflow-x: auto;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
</style>
