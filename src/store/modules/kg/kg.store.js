import * as d3 from 'd3'
import kgActionTypes from './kg.type'
import kbUtils from '@/utils/kbUtils'
import KGNodeMixin from '@/store/modules/kg/mixins/kg-node.mixin'
import KgRelationMixin from '@/store/modules/kg/mixins/kg-relation.mixin'
import { GRAPH_QUERY_RESULT_VIEW_TYPE, GRAPH_QUERY_TYPE, GRAPH_VIEW_TYPE } from '@/utils/const'
import applyBasicAction from '@/store/common.store'

const types = kgActionTypes

function getDefaultGraphView (isAll = false) {
    return {
        id: isAll ? 'all' : '1',
        name: '',
        type: isAll ? GRAPH_VIEW_TYPE.ALL : GRAPH_VIEW_TYPE.QUERY,
        queryType: GRAPH_QUERY_TYPE.RAW,
        rawQuery: '',
        simpleQuery: [{
            id: 'default',
            name: 'node',
            type: 'node',
            data: '',
            output: ''
        }],
        queryResultViewType: GRAPH_QUERY_RESULT_VIEW_TYPE.GRAPH,
        showQuery: true,
        graphZoom: new d3.ZoomTransform(1, 0, 0),
        graphData: {
            nodeList: [],
            linkList: []
        },
        queryData: [],
        showColor: true
    }
}

let initialGraphView = getDefaultGraphView(true)
const state = {
    shouldUpdateActiveNodeRelation: 0,
    shouldRunQueryAgain: 0,
    activeNode: null,
    activeRelation: null,
    nodeList: [],
    relationTypeList: [],
    config: {
        style: {
            map_label_color: {}
        }
    },
    queryHistory: [],
    // graph view
    activeGraphViewIndex: 0,
    activeGraphViewId: initialGraphView.id,
    graphViewList: [initialGraphView]
}

const mutations = {
    [types.SHOULD_RUN_QUERY_AGAIN]: (state) => {
        state.shouldRunQueryAgain = new Date().getTime()
    },
    [types.SHOULD_UPDATE_ACTIVE_NODE_RELATION]: (state) => {
        state.shouldUpdateActiveNodeRelation = new Date().getTime()
    },
    [types.ACTIVE_ITEM]: (state, item) => {
        if (kbUtils.isNode(item)) {
            state.activeNode = item
            state.activeRelation = null
        } else {
            state.activeNode = null
            state.activeRelation = item
        }
    },
    [types.ADD_GRAPH_VIEW]: (state, payload) => {
        let type = GRAPH_VIEW_TYPE.QUERY
        if (payload && payload.type) {
            type = payload.type
        }
        if (type === GRAPH_VIEW_TYPE.ALL) {
            let allTab = state.graphViewList.findIndex(item => item.type === GRAPH_VIEW_TYPE.ALL)
            if (allTab >= 0) {
                state.activeGraphViewIndex = allTab
                state.activeGraphViewId = state.graphViewList[allTab].id
                return
            }
        }
        let graphView = getDefaultGraphView()
        if (type === GRAPH_VIEW_TYPE.ALL) {
            graphView.id = 'all'
            graphView.queryResultViewType = GRAPH_QUERY_RESULT_VIEW_TYPE.GRAPH
        } else {
            let lastItem = state.graphViewList[state.graphViewList.length - 1]
            if (Number.isNaN(Number(lastItem.id))) {
                if (state.graphViewList.length === 1) {
                    graphView.id = '1'
                } else {
                    lastItem = state.graphViewList[state.graphViewList.length - 2]
                    graphView.id = String(Number(lastItem.id) + 1)
                }
            } else {
                graphView.id = String(Number(lastItem.id) + 1)
            }
            graphView.queryResultViewType = GRAPH_QUERY_RESULT_VIEW_TYPE.TABLE
        }
        graphView.type = type
        state.graphViewList.push(graphView)
        state.activeGraphViewIndex = state.graphViewList.length - 1
        state.activeGraphViewId = graphView.id
    },
    [types.UPDATE_GRAPH_VIEW]: (state, payload) => {
        let graphView = state.graphViewList.find(item => item.id === payload.id)
        // graphView may empty in case it got deleted
        if (graphView) {
            for (let i in payload.data) {
                graphView[i] = payload.data[i]
            }
        }
    },
    [types.DELETE_GRAPH_VIEW]: (state, graphViewId) => {
        if (state.graphViewList.length < 2) {
            return
        }
        let graphViewIndex = state.graphViewList.findIndex(item => item.id === graphViewId)
        if (graphViewIndex < state.activeGraphViewIndex) {
            state.activeGraphViewIndex--
        }
        if (graphViewIndex === state.activeGraphViewIndex) {
            if (graphViewIndex === state.graphViewList.length - 1) {
                state.activeGraphViewIndex--
            }
        }
        state.graphViewList.splice(graphViewIndex, 1)
        state.activeGraphViewId = state.graphViewList[state.activeGraphViewIndex].id
    },
    [types.ACTIVE_GRAPH_VIEW_INDEX] (state, payload) {
        state.activeGraphViewIndex = payload
        state.activeGraphViewId = state.graphViewList[state.activeGraphViewIndex].id
    },
    [types.ACTIVE_GRAPH_VIEW_ID] (state, payload) {
        state.activeGraphViewId = payload
        state.activeGraphViewIndex = state.graphViewList.findIndex(item => item.id === state.activeGraphViewId)
    },
    [types.CLEAR_ALL_DATA] (state) {
        let initialGraphView = getDefaultGraphView(true)
        state.activeGraphViewIndex = 0
        state.activeGraphViewId = initialGraphView.id
        state.graphViewList = [initialGraphView]
    },
    [types.ADD_QUERY_HISTORY] (state, query) {
        state.queryHistory.unshift({
            timeAccessed: new Date(),
            query: query
        })
    }
}

const actions = {
    ...KGNodeMixin,
    ...KgRelationMixin
}

// basic actions
const ForwardToMutationList = [
    types.ACTIVE_ITEM,
    types.SHOULD_UPDATE_ACTIVE_NODE_RELATION,
    types.SHOULD_RUN_QUERY_AGAIN,
    types.CLEAR_ALL_DATA,
    types.ADD_GRAPH_VIEW,
    types.UPDATE_GRAPH_VIEW,
    types.DELETE_GRAPH_VIEW,
    types.ACTIVE_GRAPH_VIEW_INDEX,
    types.ACTIVE_GRAPH_VIEW_ID,
    types.ADD_QUERY_HISTORY
]

const SetActionTypeList = [
    {
        actionType: types.ACTIVE_RELATION,
        stateProperty: 'activeRelation'
    }, {
        actionType: types.ACTIVE_NODE,
        stateProperty: 'activeNode'
    }, {
        actionType: types.NODE_LIST,
        stateProperty: 'nodeList'
    }, {
        actionType: types.RELATION_TYPE_LIST,
        stateProperty: 'relationTypeList'
    }
]

applyBasicAction(actions, mutations, ForwardToMutationList, SetActionTypeList)

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
