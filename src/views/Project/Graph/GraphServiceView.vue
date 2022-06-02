<template>
    <div>
        <GraphNodeCreator ref="GraphNodeCreator"></GraphNodeCreator>
        <GraphRelationCreator ref="GraphRelationCreator"></GraphRelationCreator>
        <GraphHyperEdgeCreator ref="GraphHyperEdgeCreator"></GraphHyperEdgeCreator>
        <HistoryQuery ref="HistoryQuery"></HistoryQuery>
    </div>
</template>

<script>
import { AppEventBusType } from '@/eventbus/app.eventbus'
import BaseServiceView from '@/modules/fptai/components/BaseServiceView'
import GraphNodeCreator from '@/views/Project/Graph/Editor/GraphNodeCreator'
import GraphRelationCreator from '@/views/Project/Graph/Editor/GraphRelationCreator'
import GraphHyperEdgeCreator from '@/views/Project/Graph/Editor/GraphHyperEdgeCreator'
import HistoryQuery from '@/views/Project/Graph/Editor/HistoryQuery'

export default {
    name: 'GraphServiceView',
    components: {
        HistoryQuery,
        GraphHyperEdgeCreator,
        GraphRelationCreator,
        GraphNodeCreator
    },
    extends: BaseServiceView,
    data () {
        return {
            TypeMap: {
                [AppEventBusType.OPEN_GRAPH_NODE_CREATOR]: 'GraphNodeCreator',
                [AppEventBusType.OPEN_GRAPH_RELATION_CREATOR]: 'GraphRelationCreator',
                [AppEventBusType.OPEN_GRAPH_HYPEREDGE_CREATOR]: 'GraphHyperEdgeCreator',
                [AppEventBusType.OPEN_QUERY_HISTORY]: 'HistoryQuery'
            }
        }
    }
}
</script>

<style scoped lang="scss">

</style>
