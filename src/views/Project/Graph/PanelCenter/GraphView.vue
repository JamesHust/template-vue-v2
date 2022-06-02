<template>
    <div class="GraphView">
        <div class="d-flex align-center justify-space-between" style="padding: 0  12px 12px 12px">
            <div class="d-flex align-center">
                <FciButtonToggle
                        :items="queryResultViewTypeList"
                        v-model="queryResultViewType"
                        :height="32"
                ></FciButtonToggle>
                <FciZoom
                        v-if="queryResultViewType === GRAPH_QUERY_RESULT_VIEW_TYPE.GRAPH"
                        :height="32"
                        :value="graphZoom.k"
                        @input="updateGraphZoom"
                        style="margin-left: 8px"
                ></FciZoom>
                <div class="btn-fill-color" :title="$f.tc('showColor')"
                     :style="[showColor ? {'background': '#0052cc', 'border-color': '#0052cc'} : '']"
                     @click="showColor = !showColor">
                    <img :src="showColor ? '/img/graph/palette-white.svg' : '/img/graph/palette.svg'" alt="icon_fill_color">
                </div>
                <!--                <v-btn depressed small color="primary" class="ml-3" @click="openQueryTemplate">-->
                <!--                    {{ $f.tc('queryTemplate') }}-->
                <!--                </v-btn>-->
                <v-layout v-if="showQuery && type === GRAPH_VIEW_TYPE.QUERY" align-center>
                    <!--            <FciButtonToggle-->
                    <!--                :items="queryTypeList"-->
                    <!--                v-model="queryType"-->
                    <!--                :height="32"-->
                    <!--            ></FciButtonToggle>-->
                    <div class="btn-run" @click="runQuery">
                        <img src="/img/graph/play.svg" alt="icon_run" style="margin-right: 6px">
                        {{ $f.tc('run') }}
                    </div>
                    <div class="btn-outline btn-icon" @click="copySimpleQuery" v-if="showQuery">
                        <img src="/img/graph/copy.svg" alt="icon_copy">
                    </div>
                    <div class="btn-outline btn-icon" @click="pasteSimpleQuery" v-if="showQuery">
                        <img src="/img/graph/paste.svg" alt="icon_paste">
                    </div>
                    <div
                            v-if="showQuery && queryType === GRAPH_QUERY_TYPE.SIMPLE"
                            @click="convertSimpleQueryToRaw"
                    >
                        <v-icon small class="mr-1">mdi-arrow-right</v-icon>
                        raw
                    </div>
                </v-layout>
            </div>
            <div class="d-flex align-center">
                <div style="color: #8C8C8C; font-size: 14px ; font-weight: 400">
                    {{ nodeCount }} {{ $t('nodes') }} - {{ linkCount }} {{ $t('relations') }}
                </div>
                <div class="btn-outline" @click="openQueryHistory">
                    <img src="/img/graph/history.svg" alt="icon_history" style="margin-right: 6px">
                    {{ $f.tc('history') }}
                </div>
                <div class="btn-fill-color" :title="$f.tc('showColor')"
                     :style="[showQuery ? {'background': '#0052cc', 'border-color': '#0052cc'} : '']"
                     v-if="type === GRAPH_VIEW_TYPE.QUERY" @click="toggleShowQuery">
                    <img :src="showQuery ? '/img/graph/code-white.svg' : '/img/graph/code.svg'" alt="icon_show_query">
                </div>
            </div>
        </div>
        <div class="query-container" v-if="showQuery && type === GRAPH_VIEW_TYPE.QUERY">
            <v-textarea
                    outlined
                    hide-details
                    v-if="queryType === GRAPH_QUERY_TYPE.RAW"
                    v-model="rawQuery"
                    ref="input"
                    class="fci-scrollbar"
                    :rows="4"
                    auto-grow="false"
            />
            <!--            <KBSimpleQuery-->
            <!--                v-else-->
            <!--                v-model="simpleQuery"-->
            <!--            ></KBSimpleQuery>-->
        </div>
        <GraphVisual
                v-if="queryResultViewType === GRAPH_QUERY_RESULT_VIEW_TYPE.GRAPH"
                style="flex: 1 1 100px;"
                ref="GraphVisual"
                :graph-view-id="graphViewId"
                :graph-data="graphData"
                :graph-zoom="graphZoom"
                :update-layout="updateGraphLayout"
                :show-color="showColor"
                @update-zoom="syncGraphZoom"
                @save-layout="saveGraphLayout"
                @expand-node="expandNode"
        ></GraphVisual>
        <GraphTable
                v-else
                :graph-view-id="graphViewId"
                :query-data="queryData"
                style="flex: 1 1 100px"
        ></GraphTable>
    </div>
</template>

<script>
import * as d3 from 'd3'
import GraphVisual from '@/views/Project/Graph/PanelCenter/GraphVisual'
import { GraphNodeService, GraphService } from '@/services/project.service'
import kbUtils from '@/utils/kbUtils'
import { GRAPH_QUERY_RESULT_VIEW_TYPE, GRAPH_QUERY_TYPE, GRAPH_VIEW_TYPE } from '@/utils/const'
import { AppEventBus, AppEventBusType } from '@/eventbus/app.eventbus'
import { mapState } from 'vuex'
import FciButtonToggle from '@/components/fci/FciButtonToggle'
import FciZoom from '@/components/fci/FciZoom'
import GraphTable from '@/views/Project/Graph/PanelCenter/GraphTable'
import { GraphNodeTemplateService, GraphTemplateService } from '@/services/template.service'

export default {
    name: 'GraphView',
    components: {
        GraphTable,
        FciZoom,
        FciButtonToggle,
        GraphVisual
    },
    props: ['graphViewId'],
    data () {
        return {
            GRAPH_VIEW_TYPE,
            GRAPH_QUERY_TYPE,
            GRAPH_QUERY_RESULT_VIEW_TYPE,
            queryResultViewTypeList: [
                {
                    icon: 'Table',
                    value: GRAPH_QUERY_RESULT_VIEW_TYPE.TABLE
                },
                {
                    icon: 'Graph',
                    value: GRAPH_QUERY_RESULT_VIEW_TYPE.GRAPH
                }
            ],
            nodeCount: 0,
            linkCount: 0,
            id: '1',
            name: '',
            type: GRAPH_VIEW_TYPE.QUERY,
            queryType: GRAPH_VIEW_TYPE.RAW,
            rawQuery: '',
            simpleQuery: [],
            queryResultViewType: GRAPH_QUERY_RESULT_VIEW_TYPE.TABLE,
            showQuery: true,
            graphZoom: new d3.ZoomTransform(1, 0, 0),
            graphData: {
                nodeList: [],
                linkList: []
            },
            queryData: [],
            updateGraphLayout: false,
            eventBusHandler: null,
            showColor: true,
            projectId: null,
            graphService: this.mode === 'projects' ? GraphService : GraphTemplateService
        }
    },
    computed: {
        ...mapState({
            shouldRunQueryAgain: state => state.kg.shouldRunQueryAgain,
            graphViewList: state => state.kg.graphViewList,
            mode: state => state.mode
        })
        // queryTypeList () {
        //     return [
        //         {
        //             text: this.$f.tc('raw'),
        //             value: GRAPH_QUERY_TYPE.RAW
        //         },
        //         {
        //             text: this.$f.tc('simple'),
        //             value: GRAPH_QUERY_TYPE.SIMPLE
        //         }
        //     ]
        // }
    },
    mounted () {
        this.projectId = this.$route.params.projectId
        this.graphService = this.mode === 'projects' ? GraphService : GraphTemplateService
        this.loadDataFromStore()
        // receive event from event bus
        this.eventBusHandler = node => {
            if (this.graphViewId !== this.$store.state.kg.activeGraphViewId) {
                return
            }
            this.queryType = GRAPH_QUERY_TYPE.RAW
            this.rawQuery = `FOR c in nodes\n  FILTER c._query_name == '${node._query_name}'\n    FOR v, e IN 1..1 ANY c GRAPH 'KnowledgeGraph'\n      RETURN {s: c, r: e, t:v}`
            this.runQuery()
        }
        AppEventBus.on(AppEventBusType.CREATE_QUERY_FROM_NODE, this.eventBusHandler)
    },
    beforeDestroy () {
        this.saveDataToStore()
    },
    destroyed () {
        AppEventBus.off(AppEventBusType.CREATE_QUERY_FROM_NODE, this.eventBusHandler)
    },
    methods: {
        loadDataFromStore () {
            let graphView = this.$store.state.kg.graphViewList.find(item => item.id === this.graphViewId)
            this.type = graphView.type
            this.queryType = graphView.queryType
            this.rawQuery = graphView.rawQuery
            this.simpleQuery = graphView.simpleQuery
            this.queryResultViewType = graphView.queryResultViewType
            this.showQuery = graphView.showQuery
            this.graphZoom = graphView.graphZoom
            this.graphData = graphView.graphData
            this.queryData = graphView.queryData
            this.showColor = graphView.showColor

            if (this.type === GRAPH_VIEW_TYPE.ALL) {
                this.updateGraphLayout = false
                this.$nextTick(() => {
                    this.$refs.GraphVisual.resizeSvg()
                })
                if (this.graphData.nodeList.length < 1) {
                    this.getAllGraphData()
                }
            } else {
                this.updateGraphLayout = true
            }
        },
        saveDataToStore () {
            if (this.projectId !== this.$route.params.projectId) {
                return
            }
            this.$store.dispatch(this.$at.kg.UPDATE_GRAPH_VIEW, {
                id: this.graphViewId,
                data: {
                    type: this.type,
                    queryType: this.queryType,
                    rawQuery: this.rawQuery,
                    simpleQuery: this.simpleQuery,
                    queryResultViewType: this.queryResultViewType,
                    showQuery: this.showQuery,
                    graphZoom: this.graphZoom,
                    graphData: this.graphData,
                    queryData: this.queryData,
                    showColor: this.showColor
                }
            })
            if (this.type === GRAPH_VIEW_TYPE.ALL) {
                this.saveGraphLayout()
            }
        },
        getAllGraphData () {
            this.graphService.getAllGraphData(this.$route.params.projectId).then(result => {
                this.graphData = kbUtils.parseGraph(result.data)
            })
        },
        saveGraphLayout () {
            if (!this.$route.params.projectId) {
                return
            }
            let data = this.graphData.nodeList.map(node => ({
                node_id: node.id,
                _x: node.x,
                _y: node.y,
                _z: node.z
            }))
            this.graphService.saveLayout(this.$route.params.projectId, data)
        },
        syncGraphZoom (value) {
            this.graphZoom = value
        },
        expandNode (item) {
            let graphNodeService = this.mode === 'projects' ? GraphNodeService : GraphNodeTemplateService
            graphNodeService.getRelationships(
                this.$route.params.projectId,
                item.data._key
            ).then(result => {
                this.graphData = kbUtils.appendGraphData(this.graphData, result.data)
            })
        },
        updateGraphZoom (value) {
            let graphZoom = this.graphZoom
            if (value === graphZoom.k) {
                return
            }
            let rect = this.$refs.GraphVisual.$el.getBoundingClientRect()
            let svgWidth = rect.width
            let svgHeight = rect.height
            let center = {
                x: svgWidth / 2,
                y: svgHeight / 2
            }
            let distance = {
                x: svgWidth / 2 - graphZoom.x,
                y: svgHeight / 2 - graphZoom.y
            }
            this.graphZoom = new d3.ZoomTransform(
                value,
                center.x - distance.x * (value / graphZoom.k),
                center.y - distance.y * (value / graphZoom.k)
            )
        },
        getGraphView () {
            return this.$store.state.kg.graphViewList.find(item => item.id === this.graphViewId)
        },
        runQuery () {
            let promise = null
            if (this.queryType === GRAPH_QUERY_TYPE.RAW) {
                promise = Promise.resolve(this.rawQuery)
            } else {
                promise = this.graphService.getRawQuery(this.$route.params.projectId, this.simpleQuery).then(result => {
                    return result.data
                })
            }
            promise.then(rawQuery => {
                if (!rawQuery) {
                    return
                }
                // add raw query to history
                this.$store.dispatch(this.$at.kg.ADD_QUERY_HISTORY, rawQuery)
                this.graphService.runQuery(
                    this.$route.params.projectId,
                    rawQuery
                ).then(result => {
                    this.queryData = result.data
                    if (this.queryData.length < 1) {
                        this.$appService.toastSuccess(this.$f.tc('queryResultEmpty'))
                    }
                    if (kbUtils.isGraphDataFormat(this.queryData)) {
                        this.graphData = kbUtils.parseQueryDataToGraph(this.queryData)
                    } else {
                        this.graphData = {
                            nodeList: [],
                            linkList: []
                        }
                        this.queryResultViewType = GRAPH_QUERY_RESULT_VIEW_TYPE.TABLE
                    }
                })
            })
        },
        openQueryHistory () {
            this.$appService.useEventBus(AppEventBusType.OPEN_QUERY_HISTORY).then(query => {
                this.rawQuery = query
                this.runQuery()
            })
        },
        convertSimpleQueryToRaw () {
            // this.graphService.getRawQuery(this.$route.params.projectId, this.simpleQuery).then(result => {
            //     this.queryType = GRAPH_QUERY_TYPE.RAW
            //     this.rawQuery = result.data
            // })
        },
        copySimpleQuery () {
            this.$utils.copyToClipboard(JSON.stringify(this.simpleQuery), this.$f.tc('copied'))
        },
        pasteSimpleQuery () {
            navigator.clipboard.readText().then(text => {
                try {
                    this.simpleQuery = JSON.parse(text)
                } catch (e) {
                    this.$appService.toastError('Data invalid')
                }
            }).catch(() => {
                this.$appService.toastInfo('Please allow reading from clipboard')
            })
        },
        toggleShowQuery () {
            this.showQuery = !this.showQuery
            this.$nextTick(() => {
                this.$refs.GraphVisual.resizeSvg()
            })
        },
        openQueryTemplate () {
            // this.$appService.useEventBus(AppEventBusType.OPEN_KB_QUERY_TEMPLATE_SELECTOR).then(item => {
            //     this.queryType = item.type
            //     if (this.queryType === GRAPH_QUERY_TYPE.RAW) {
            //         this.rawQuery = item.query
            //     } else {
            //         this.simpleQuery = item.query
            //     }
            // })
        }
    },
    watch: {
        shouldRunQueryAgain () {
            if (this.type === GRAPH_VIEW_TYPE.QUERY) {
                this.runQuery()
            } else {
                this.getAllGraphData()
            }
        }
    }
}
</script>

<style scoped lang="scss">
.GraphView {
  flex: 1;
  display: flex;
  flex-direction: column;

  .query-container {
    padding: 0 12px 12px 12px;
  }

  ::v-deep .custom-checkbox .v-input__slot {
    padding-top: 2px;

    .v-label {
      font-size: 14px;
      color: #8C8C8C;
    }
  }

  ::v-deep textarea {
    font-size: 14px;
    margin-top: 6px !important;
    line-height: 22px;
  }

  ::v-deep .theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot fieldset {
    color: #D9D9D9 !important;
  }
}

.btn-fill-color {
  cursor: pointer;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #D9D9D9;
  border-radius: 5px;
  margin-left: 8px;

  &:hover {
    background: #d1d2d5;
  }
}

.btn-run {
  cursor: pointer;
  height: 32px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #D9D9D9;
  border-radius: 5px;
  margin-left: 8px;
  color: #FFFFFF;
  background: #0052cc;
  &:hover {
    background: #0160ed;
  }
}

.btn-outline {
  cursor: pointer;
  padding: 0 16px;
  border: 1px solid #D9D9D9;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  height: 32px;
  margin-left: 8px;
  color: #262626;
  background: #F5F5F5;

  &:hover {
    background: #d1d2d5;
  }
}

.btn-icon {
  padding: 0;
  width: 32px !important;
}
</style>
