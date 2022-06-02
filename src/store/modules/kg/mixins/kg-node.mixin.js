import KGActionType from '../kg.type'
import { GraphNodeService } from '@/services/project.service.js'
import store from '@/store/store'
import { GraphNodeTemplateService } from '@/services/template.service'

const types = KGActionType

const KGNodeMixin = {
    [types.GET_NODE_LIST]: (context, payload) => {
        let itemService = store ? (store.state.mode === 'projects' ? GraphNodeService : GraphNodeTemplateService) : GraphNodeService
        let projectId = payload || window.vueapp.$route.params.projectId
        return itemService.search(projectId).then(result => {
            let nodeList = result.data
            context.dispatch(types.NODE_LIST, nodeList)
            return nodeList
        })
    },
    [types.CLONE_NODE] (context, payload) {
        let itemService = store ? (store.state.mode === 'projects' ? GraphNodeService : GraphNodeTemplateService) : GraphNodeService
        itemService.cloneNode(payload.projectId, payload._key).then(() => {
            context.dispatch(types.SHOULD_RUN_QUERY_AGAIN)
            context.dispatch(types.GET_NODE_LIST)
        })
    },
    [types.CREATE_NODE] (context, payload) {
        let itemService = store ? (store.state.mode === 'projects' ? GraphNodeService : GraphNodeTemplateService) : GraphNodeService
        itemService.create(payload.projectId, payload.data).then(() => {
            context.dispatch(types.SHOULD_RUN_QUERY_AGAIN)
            context.dispatch(types.GET_NODE_LIST)
        })
    },
    [types.UPDATE_NODE]: (context, payload) => {
        let itemService = store ? (store.state.mode === 'projects' ? GraphNodeService : GraphNodeTemplateService) : GraphNodeService
        itemService.replace(payload.projectId, payload.id, payload.data).then(() => {
            context.dispatch(types.SHOULD_RUN_QUERY_AGAIN)
            context.dispatch(types.GET_NODE_LIST).then(nodeList => {
                let activeNode = context.state.activeNode
                if (activeNode && activeNode.id === payload.id) {
                    let node = nodeList.find(node => node.id === payload.id)
                    context.commit(types.ACTIVE_NODE, node)
                }
            })
        })
    },
    [types.DELETE_NODE]: (context, payload) => {
        let itemService = store ? (store.state.mode === 'projects' ? GraphNodeService : GraphNodeTemplateService) : GraphNodeService
        itemService.delete(payload.projectId, payload._key).then(() => {
            context.dispatch(types.SHOULD_RUN_QUERY_AGAIN)
            context.dispatch(types.GET_NODE_LIST)
            let activeNode = context.state.activeNode
            if (activeNode && activeNode._key === payload._key) {
                context.commit(types.ACTIVE_NODE, null)
            } else {
                context.commit(types.SHOULD_UPDATE_ACTIVE_NODE_RELATION)
            }
        })
    },
    [types.ADD_HYPEREDGE]: (context, payload) => {
        let hyperedge = payload.data
        let itemService = store ? (store.state.mode === 'projects' ? GraphNodeService : GraphNodeTemplateService) : GraphNodeService
        itemService.addHyperedge(
            payload.projectId,
            hyperedge
        ).then(() => {
            context.dispatch(types.GET_NODE_LIST).then(() => {
                context.dispatch(types.SHOULD_RUN_QUERY_AGAIN)
            })
            let activeNode = context.state.activeNode
            if (!activeNode) {
                return
            }
            if (hyperedge.start_id === activeNode.id) {
                context.commit(types.SHOULD_UPDATE_ACTIVE_NODE_RELATION)
            }
            context.dispatch(types.GET_RELATION_TYPE_LIST, { projectId: payload.projectId })
        })
    }
}

export default KGNodeMixin
