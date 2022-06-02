import KGActionType from '../kg.type'
import { GraphRelationService } from '@/services/project.service.js'
import store from '@/store/store'
import { GraphRelationTemplateService } from '@/services/template.service'

const types = KGActionType

const KbRelationMixin = {
    [types.CREATE_RELATION] (context, payload) {
        let relation = payload.data
        let itemService = store ? (store.state.mode === 'projects' ? GraphRelationService : GraphRelationTemplateService) : GraphRelationService
        return itemService.create(payload.projectId, relation).then(() => {
            context.dispatch(types.SHOULD_RUN_QUERY_AGAIN)
            let activeNode = context.state.activeNode
            if (!activeNode) {
                return
            }
            if (relation.start_id === activeNode.id || relation.end_id === activeNode.id) {
                context.commit(types.SHOULD_UPDATE_ACTIVE_NODE_RELATION)
            }
            context.dispatch(types.GET_RELATION_TYPE_LIST, { projectId: payload.projectId })
        })
    },
    [types.UPDATE_RELATION]: (context, payload) => {
        let itemService = store ? (store.state.mode === 'projects' ? GraphRelationService : GraphRelationTemplateService) : GraphRelationService
        return itemService.replace(payload.projectId, payload.id, payload.data).then(() => {
            context.dispatch(types.SHOULD_RUN_QUERY_AGAIN)
        })
    },
    [types.DELETE_RELATION]: (context, payload) => {
        let relation = payload.relation
        let itemService = store ? (store.state.mode === 'projects' ? GraphRelationService : GraphRelationTemplateService) : GraphRelationService
        return itemService.delete(payload.projectId, relation._key).then(() => {
            context.dispatch(types.SHOULD_RUN_QUERY_AGAIN)
            let activeNode = context.state.activeNode
            if (activeNode) {
                if (relation._from === activeNode._id || relation._to === activeNode._id) {
                    context.commit(types.SHOULD_UPDATE_ACTIVE_NODE_RELATION)
                }
            }
            let activeRelation = context.state.activeRelation
            if (activeRelation && relation._id === activeRelation._id) {
                context.commit(types.ACTIVE_RELATION, null)
            }
        })
    },
    [types.GET_RELATION_TYPE_LIST]: (context, payload) => {
        let itemService = store ? (store.state.mode === 'projects' ? GraphRelationService : GraphRelationTemplateService) : GraphRelationService
        return itemService.getTypes(payload.projectId).then(result => {
            context.dispatch(types.RELATION_TYPE_LIST, result.data)
        })
    }
}

export default KbRelationMixin
