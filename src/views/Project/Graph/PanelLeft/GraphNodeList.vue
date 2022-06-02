<template>
    <div class="GraphNodeList">
        <v-layout style="padding: 12px 10px; height: 56px">
            <input
                    class="fci-input search-input"
                    :placeholder="$f.tc('searchNode')"
                    v-model="searchKey"
            >
        </v-layout>
        <div class="fci-list fci-scrollbar">
            <v-layout justify-space-between align-center
                      v-for="item in filterItems"
                      :key="item.id"
                      class="fci-list-item"
                      :class="{active: activeNode._id === item._id}"
                      :style="getItemStyle(item)"
                      @click="selectItem(item)"
                      @contextmenu="onContextMenu($event, item)"
            >
                {{ item._name }}
                <v-btn
                        icon
                        small
                        class="icon-contextmenu"
                        @click.stop="onContextMenu($event, item)"
                        style="transform: scale(0.9)"
                >
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
            </v-layout>
            <GraphNodeListContextMenu
                    ref="GraphNodeListContextMenu"
                    @action="doContextAction"
            ></GraphNodeListContextMenu>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { AppEventBus, AppEventBusType } from '@/eventbus/app.eventbus'
import GraphNodeListContextMenu from './GraphNodeListContextMenu'
import { GRAPH_NODE_LIST_CMA, GRAPH_VIEW_TYPE } from '@/utils/const'

export default {
    name: 'GraphNodeList',
    components: { GraphNodeListContextMenu },
    data () {
        return {
            searchKey: ''
        }
    },
    computed: {
        ...mapState({
            items: state => state.kg.nodeList.filter(i => !i._hyperedge),
            activeNode: state => state.kg.activeNode || {}
        }),
        filterItems () {
            let searchKey = this.searchKey.trim()
            if (!searchKey) {
                return this.items
            }
            return this.items.filter(item => item._name.includes(searchKey))
        }
    },
    mounted () {
        this.$store.dispatch(this.$at.kg.GET_NODE_LIST)
    },
    methods: {
        selectItem (item) {
            this.$store.dispatch(this.$at.kg.ACTIVE_ITEM, item)
            this.runGraphQuery(item)
        },
        runGraphQuery (item) {
            let graphViewList = this.$store.state.kg.graphViewList
            if (
                graphViewList.length === 1 &&
                graphViewList[0].type === GRAPH_VIEW_TYPE.ALL
            ) {
                this.$store.dispatch(this.$at.kg.ADD_GRAPH_VIEW).then(() => {
                    AppEventBus.emit(AppEventBusType.CREATE_QUERY_FROM_NODE, item)
                })
            } else {
                AppEventBus.emit(AppEventBusType.CREATE_QUERY_FROM_NODE, item)
            }
        },
        onContextMenu (e, item) {
            e.preventDefault()
            this.$refs.GraphNodeListContextMenu.open(e, item)
        },
        doContextAction (action) {
            let {
                name,
                item
            } = action
            switch (name) {
                case GRAPH_NODE_LIST_CMA.ACTIVE_NODE: {
                    this.$store.dispatch(this.$at.kg.ACTIVE_ITEM, item)
                    break
                }
                case GRAPH_NODE_LIST_CMA.CREATE_QUERY: {
                    this.runGraphQuery(item)
                    break
                }
            }
            this.$refs.GraphNodeListContextMenu.close()
        },
        getItemStyle (item) {
            if (item._labels.length < 1) {
                return {
                    borderLeftColor: '#fff'
                }
            } else {
                let mapLabelColor = this.$store.state.kg.config.style.map_label_color
                let firstLabel = item._labels[0]
                return {
                    borderLeftColor: mapLabelColor[firstLabel] || '#fff'
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
.GraphNodeList {
  background: #fff;
  height: 100%;
  overflow: hidden;
  font-size: 14px;

  .fci-input {
    border-radius: 5px;
    border: 1px solid #D9D9D9;
    background: url('/img/graph/search.svg') no-repeat center right 10px;
  }

  .btn-search {
    background-color: #F5F5F5;
    height: 32px;
    width: 38px;
    border-radius: 0 5px 5px 0;
    border: 1px solid #D9D9D9;
    border-left: none;
    box-sizing: border-box;
    cursor: pointer;

    &:hover {
      background: #e5e5e5;
    }
  }
}

.search-input {
  width: 100%;
  height: 32px;
}

.fci-list {
  height: calc(100% - 56px);
  overflow: auto;

  .fci-list-item {
    border-style: solid;
    border-width: 0 5px 0 6px;
    border-color: #fff;
    border-top: 1px solid #F0F0F0;
    padding: 6px 6px 6px 6px;

    &:last-child {
      border-bottom: 1px solid #F0F0F0;
    }

    &:hover {
      background-color: #E6F4FF;
      border-color: #E6F4FF;

      & .icon-contextmenu {
        visibility: visible;
      }
    }

    &.active {
      color: #0052cc;
      font-weight: bold;
      border-color: #0052cc;
      background-color: #E6F4FF;
      border-top: 1px solid #F0F0F0;
    }
  }
}

.icon-contextmenu {
  visibility: hidden;
}
</style>
