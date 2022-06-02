<template>
    <div>
        <div class="GraphMain fci-page" :key="projectId">
            <div class="panel-left">
                <GraphNodeList ref="GraphNodeList"></GraphNodeList>
            </div>
            <div class="panel-center">
                <div style="display: flex; padding: 12px">
                    <FciTabs :items="tabList" v-model="activeGraphViewId" @close-tab="deleteGraphView">
                        <template v-slot:item="props">
                            <div
                                    class="d-flex align-center"
                                    style="flex: 1 1 10px; font-size: 14px; margin-left: 10px"
                                    :style="[tabList.length <= 1 ? {'justify-content': 'center !important', 'margin-left': '0 !important'} : '']"
                            >
                                {{$f.tc('tab')}} {{ props.item.text }}
                            </div>
                        </template>
                    </FciTabs>
                    <div class="btn-add-tab" @click="addGraphView">
                        <img src="/img/graph/add-circle.svg" alt="icon_add_tab" style="margin-right: 6px">
                        {{$f.tc('newTab')}}
                    </div>
                    <v-spacer></v-spacer>
                    <div class="button-toolbar button-toolbar-outline" @click="addShowAll">
                        <img src="/img/graph/show-all.svg" alt="icon_add_hyperedge" style="margin-right: 6px">
                        {{ $f.tc('showAll') }}
                    </div>
                    <div class="button-toolbar" @click="addHyperedge">
                        <img src="/img/graph/plus-circle.svg" alt="icon_add_hyperedge" style="margin-right: 6px; transform: scale(1.1)">
                        {{ $f.tc('hyperedge') }}
                    </div>
                    <div class="button-toolbar" @click="addNode">
                        <img src="/img/graph/plus-circle.svg" alt="icon_add_node" style="margin-right: 6px; transform: scale(1.1)">
                        {{ $f.tc('node') }}
                    </div>
                    <div class="button-toolbar" @click="addRelation">
                        <img src="/img/graph/plus-circle.svg" alt="icon_add_relation" style="margin-right: 6px; transform: scale(1.1)">
                        {{ $f.tc('relation') }}
                    </div>
                </div>
                <template v-for="graphView in graphViewList">
                    <GraphView
                            :key="graphView.id"
                            v-if="graphView.id === activeGraphViewId"
                            :graph-view-id="graphView.id"
                    ></GraphView>
                </template>
            </div>
            <div class="panel-right">
                <div class="white-panel" v-if="!activeNode && !activeRelation">
                    {{ $f.tc('nothingToShow') }}
                </div>
                <GraphNodeEditor
                        v-if="editorType === EditorType.NODE"
                ></GraphNodeEditor>
                <GraphRelationEditor
                        v-if="editorType === EditorType.RELATION"
                ></GraphRelationEditor>
                <GraphHyperEdgeEditor
                        v-if="editorType === EditorType.HYPEREDGE"
                ></GraphHyperEdgeEditor>
            </div>
            <GraphServiceView></GraphServiceView>
        </div>
    </div>
</template>

<script>
import FciTabs from '@/modules/fptai/components/fci/FciTabs'
import GraphView from '@/views/Project/Graph/PanelCenter/GraphView'
import GraphNodeList from '@/views/Project/Graph/PanelLeft/GraphNodeList'
import { AppEventBusType } from '@/eventbus/app.eventbus'
import GraphServiceView from '@/views/Project/Graph/GraphServiceView'
import GraphNodeEditor from '@/views/Project/Graph/PanelRight/GraphNodeEditor'
import GraphRelationEditor from '@/views/Project/Graph/PanelRight/GraphRelationEditor'
import GraphHyperEdgeEditor from '@/views/Project/Graph/PanelRight/GraphHyperEdgeEditor'
import kbUtils from '@/utils/kbUtils'
import { mapState } from 'vuex'
import { GRAPH_VIEW_TYPE } from '@/utils/const'

const EditorType = {
    RELATION: 'RELATION',
    NODE: 'NODE',
    HYPEREDGE: 'HYPEREDGE'
}

export default {
    name: 'GraphMain',
    components: {
        GraphHyperEdgeEditor,
        GraphRelationEditor,
        GraphNodeEditor,
        GraphServiceView,
        GraphNodeList,
        GraphView,
        FciTabs
    },
    data () {
        return {
            EditorType,
            projectId: 'default'
        }
    },
    computed: {
        ...mapState({
            activeNode: state => state.kg.activeNode,
            activeRelation: state => state.kg.activeRelation,
            graphViewList: state => state.kg.graphViewList,
            tabList: state => state.kg.graphViewList.map(item => ({
                text: item.id,
                value: item.id
            }))
        }),
        editorType () {
            if (this.activeRelation) {
                return EditorType.RELATION
            }
            if (this.activeNode) {
                return kbUtils.isHyperedge(this.activeNode) ? EditorType.HYPEREDGE : EditorType.NODE
            }
            return null
        },
        activeGraphViewId: {
            get () {
                return this.$store.state.kg.activeGraphViewId
            },
            set (value) {
                if (value !== undefined) {
                    this.$store.dispatch(this.$at.kg.ACTIVE_GRAPH_VIEW_ID, value)
                }
            }
        }
    },
    methods: {
        addShowAll () {
            this.$store.dispatch(this.$at.kg.ADD_GRAPH_VIEW, {
                type: GRAPH_VIEW_TYPE.ALL
            })
        },
        addGraphView () {
            this.$store.dispatch(this.$at.kg.ADD_GRAPH_VIEW)
        },
        deleteGraphView (id) {
            this.$store.dispatch(this.$at.kg.DELETE_GRAPH_VIEW, id)
        },
        addNode () {
            this.$appService.useEventBus(AppEventBusType.OPEN_GRAPH_NODE_CREATOR).then(model => {
                this.$store.dispatch(this.$at.kg.CREATE_NODE, {
                    projectId: this.$route.params.projectId,
                    data: model
                })
            })
        },
        addRelation () {
            this.$appService.useEventBus(AppEventBusType.OPEN_GRAPH_RELATION_CREATOR).then(model => {
                this.$store.dispatch(this.$at.kg.CREATE_RELATION, {
                    projectId: this.$route.params.projectId,
                    data: model
                })
            })
        },
        addHyperedge () {
            this.$appService.useEventBus(AppEventBusType.OPEN_GRAPH_HYPEREDGE_CREATOR).then(model => {
                this.$store.dispatch(this.$at.kg.ADD_HYPEREDGE, {
                    projectId: this.$route.params.projectId,
                    data: model
                })
            })
        }
    },
    watch: {
        $route () {
            this.$store.dispatch(this.$at.kg.CLEAR_ALL_DATA).then(() => {
                // using projectId as key in order to recreate GraphMain when changing project in ProjectSelector
                this.projectId = this.$route.params.projectId
            })
        }
    }
}
</script>

<style scoped lang="scss">
$borderColor: #F2F4FA;
$containerBackground: #FFF;

.GraphMain {
  background: #fff;
  display: flex;
}

.panel-left {
  flex: 0 0 260px;
  overflow: hidden;
}

.panel-center {
  overflow: hidden;
  height: 100%;
  flex: 1 1 100px;
  display: flex;
  flex-direction: column;
  border-left: 2px solid #F5F5F5;
  border-right: 2px solid #F5F5F5;

  .toolbar {
    flex: 0 0 54px;
    padding-bottom: 5px;
    background: $containerBackground;
    //border-right: 1px solid #F5F5F5;
    //border-left: 1px solid #F5F5F5;
    overflow: hidden;

    textarea {
      width: 100%;
      height: 200px;
      padding: 5px;
      font-size: 16px;
      outline: none;
      border: 1px solid #D9D9D9;
      border-radius: 5px;
      resize: none;
    }
  }
}

.panel-right {
  flex: 0 0 300px;
  overflow: hidden;
}

.button-toolbar {
  cursor: pointer;
  padding: 0 16px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  height: 32px;
  margin-left: 8px;
  color: #FFFFFF;
  background: #0052cc;
  &:hover {
    background: #0160ed;
  }
}

.button-toolbar-outline {
  background: #F5F5F5;
  white-space: nowrap;
  border: 1px solid #D9D9D9;
  color: #262626;
  &:hover {
    background: #d1d2d5;
  }
}

.btn-add-tab {
  cursor: pointer;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  background: #F5F5F5;
  border-bottom: 1px solid #D9D9D9;
  white-space: nowrap;
  height: 30px;

  &:hover {
    background: #d1d2d5;
  }
}

.white-panel {
  color: #8C8C8C;
  font-size: 14px;
  font-weight: 400;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
