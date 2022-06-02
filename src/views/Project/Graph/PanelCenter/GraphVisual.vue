<template>
    <div class="GraphVisual" ref="GraphVisual">
        <svg :id="svgId"></svg>
        <GraphVisualContextMenu
            ref="NodeContextMenu"
            @action="doContextAction"
        ></GraphVisualContextMenu>
    </div>
</template>

<script>
import { GRAPH_VISUAL_CMA } from '@/utils/const'
import GraphVisualContextMenu from './GraphVisualContextMenu'
import { createGraph } from '@/views/Project/Graph/draw/kg'
import { AppEventBusType } from '@/eventbus/app.eventbus'
import { mapState } from 'vuex'
import { GraphRelationService } from '@/services/project.service'

export default {
    name: 'GraphVisual',
    components: { GraphVisualContextMenu },
    props: ['graphViewId', 'graphData', 'graphZoom', 'updateLayout', 'showColor'],
    data () {
        const svgId = 'kb-graph-' + this.graphViewId
        const nodeRadius = 25
        return {
            svgId,
            nodeCount: 0,
            linkCount: 0,
            graphInstance: null,
            dataBus: {
                nodeList: [],
                linkList: [],
                updateLayout: false,
                showColor: this.showColor,
                svgId,
                style: {
                    zoom: this.graphZoom,
                    svgWidth: 0,
                    svgHeight: 0,
                    svgPadding: 10,
                    nodeRadius: nodeRadius,
                    collideRadius: nodeRadius * 4,
                    // collideRadius: nodeRadius * 2,
                    relationCurveHeight: 20,
                    nodeStartX: nodeRadius * 4,
                    nodeStartY: nodeRadius * 4,
                    markerSize: 8,
                    activeNode: {
                        id: this.$store.state.kg.activeNode ? this.$store.state.kg.activeNode._id : null,
                        backgroundColor: '#E7A600',
                        borderColor: '#E7A600'
                    },
                    activeLink: {
                        id: this.$store.state.kg.activeRelation ? this.$store.state.kg.activeRelation._id : null,
                        color: '#E7A600'
                    },
                    mapLabelColor: {}
                },
                event: {
                    onNodeContextMenu: this.onNodeContextMenu,
                    onNodeClick: this.onNodeClick,
                    onCreateLink: this.onCreateLink,
                    onLinkClick: this.onLinkClick,
                    onZoom: this.onZoom,
                    onSaveGraphLayout: this.onSaveGraphLayout
                }
            }
        }
    },
    computed: {
        ...mapState({
            windowResized: state => state.windowResized,
            activeNode: state => state.kg.activeNode,
            activeRelation: state => state.kg.activeRelation
        })
    },
    mounted () {
        this.resizeSvg()
        this.updateGraph()
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResizeScreen)
        })
    },
    destroyed () {
        this.graphInstance.stopSimulation()
    },
    methods: {
        onResizeScreen () {
            let svgWidth = window.innerWidth - 560
            let svgHeight = window.innerHeight - 168
            const svg = document.getElementById(this.svgId)
            if (svg) {
                svg.setAttribute('width', String(svgWidth))
                svg.setAttribute('height', String(svgHeight))
                svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
            }
        },
        updateGraph () {
            this.dataBus.nodeList = this.graphData.nodeList
            this.dataBus.linkList = this.graphData.linkList
            this.nodeCount = this.dataBus.nodeList.length
            this.linkCount = this.dataBus.linkList.length
            if (this.graphInstance) {
                this.graphInstance.update(this.dataBus)
            } else {
                this.graphInstance = createGraph(this.dataBus)
            }
        },
        resizeSvg () {
            let rect = this.$refs.GraphVisual.getBoundingClientRect()
            let svgWidth = rect.width
            let svgHeight = rect.height
            const svg = document.getElementById(this.svgId)
            svg.setAttribute('width', String(svgWidth))
            svg.setAttribute('height', String(svgHeight))
            svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`)
            this.dataBus.style.svgWidth = svgWidth
            this.dataBus.style.svgHeight = svgHeight
        },
        onNodeClick (e, d) {
            this.$store.dispatch(
                this.$at.kg.ACTIVE_ITEM,
                this.$store.state.kg.nodeList.find(node => node._id === d.data._id)
            )
        },
        onNodeContextMenu (e, d) {
            this.$refs.NodeContextMenu.open(e, d)
        },
        onLinkClick (e, d) {
            GraphRelationService.read(this.$route.params.projectId, d.data._key).then(result => {
                this.$store.dispatch(this.$at.kg.ACTIVE_ITEM, result.data)
            })
        },
        onCreateLink (source, target) {
            console.log(source.data.properties.name)
            console.log(target.data.properties.name)
        },
        onZoom (value) {
            this.$emit('update-zoom', value)
        },
        onSaveGraphLayout (event) {
            this.$emit('save-layout', event)
        },
        doContextAction ({
            name,
            item
        }) {
            switch (name) {
                case GRAPH_VISUAL_CMA.EXPAND:
                    this.$emit('expand-node', item)
                    break
                case GRAPH_VISUAL_CMA.EDIT_NODE:
                    this.$store.dispatch(
                        this.$at.kg.ACTIVE_ITEM,
                        this.$store.state.kg.nodeList.find(node => node._id === item.data._id)
                    )
                    break
                case GRAPH_VISUAL_CMA.ADD_RELATION_TO:
                    this.addNodeRelation(item.data)
                    break
                case GRAPH_VISUAL_CMA.ADD_HYPEREDGE:
                    this.addHyperedge(item.data)
                    break
                case GRAPH_VISUAL_CMA.CLONE_NODE:
                    this.cloneNode(item.data)
                    break
                case GRAPH_VISUAL_CMA.DELETE:
                    this.deleteNode(item.data)
                    break
            }
        },
        deleteNode (node) {
            this.$appService.confirm(this.$f.tc('confirmDelete', { item: node._name ? node._name : node._id })).then(confirm => {
                if (confirm) {
                    this.$store.dispatch(this.$at.kg.DELETE_NODE, {
                        projectId: this.$route.params.projectId,
                        _key: node._key
                    })
                }
            })
        },
        addNodeRelation (node) {
            this.$appService.useEventBus(AppEventBusType.OPEN_GRAPH_RELATION_CREATOR, {
                _from: node._id
            }).then(model => {
                this.$store.dispatch(this.$at.kg.CREATE_RELATION, {
                    projectId: this.$route.params.projectId,
                    data: model
                })
            })
        },
        addHyperedge (node) {
            this.$appService.useEventBus(AppEventBusType.OPEN_GRAPH_HYPEREDGE_CREATOR, {
                _from: node._id
            }).then(model => {
                this.$store.dispatch(this.$at.kg.ADD_HYPEREDGE, {
                    projectId: this.$route.params.projectId,
                    data: model
                })
            })
        },
        cloneNode (node) {
            this.$store.dispatch(this.$at.kg.CLONE_NODE, {
                projectId: this.$route.params.projectId,
                _key: node._key
            })
        }
    },
    watch: {
        windowResized () {
            this.resizeSvg()
        },
        activeNode () {
            this.dataBus.style.activeNode.id = this.activeNode ? this.activeNode._id : null
            this.graphInstance.updateActive(
                this.showColor,
                this.dataBus.style.activeNode.id,
                this.dataBus.style.activeLink.id
            )
        },
        activeRelation () {
            this.dataBus.style.activeLink.id = this.activeRelation ? this.activeRelation._id : null
            this.graphInstance.updateActive(
                this.showColor,
                this.dataBus.style.activeNode.id,
                this.dataBus.style.activeLink.id
            )
        },
        graphData () {
            this.updateGraph()
        },
        graphZoom () {
            if (this.graphInstance) {
                this.dataBus.style.zoom = this.graphZoom
                this.graphInstance.zoom(this.graphZoom)
            }
        },
        updateLayout: {
            immediate: true,
            handler: function () {
                this.dataBus.updateLayout = this.updateLayout
            }
        },
        showColor () {
            this.dataBus.showColor = this.showColor
            this.graphInstance.updateColorNode(this.showColor, this.dataBus.style.activeNode.id)
        }
    }
}
</script>
<style scoped lang="scss">
@import "../draw/kg";

.GraphVisual {
    position: relative;
    overflow: hidden;
    background-color: #F5F5F5;
}
</style>
