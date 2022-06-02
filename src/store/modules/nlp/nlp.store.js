import nlpActionTypes from './nlp.type'
import applyBasicAction from '@/store/common.store'
import store from '@/store/store'
import { EntityTypeService, IntentService } from '@/services/project.service'
import { EntityTypeTemplateService, IntentTemplateService } from '@/services/template.service'

const types = nlpActionTypes

const state = {
    intentList: [],
    mapIdToIntent: new Map(),
    entityTypeList: [],
    mapIdToEntityType: new Map(),
    mapNameToEntityType: new Map()
}

const mutations = {
    [types.INTENT_LIST] (state, payload) {
        state.intentList = payload
        state.mapIdToIntent = new Map()
        state.intentList.forEach(intent => {
            state.mapIdToIntent.set(intent.id, intent)
        })
    },
    [types.ENTITY_TYPE_LIST] (state, payload) {
        state.entityTypeList = payload
        state.mapIdToEntityType = new Map()
        state.entityTypeList.forEach(entityType => {
            state.mapIdToEntityType.set(entityType.id, entityType)
        })
        state.mapNameToEntityType = new Map()
        state.entityTypeList.forEach(entityType => {
            state.mapNameToEntityType.set(entityType.name, entityType)
        })
    }
}

const actions = {
    [types.GET_INTENT_LIST] (context, payload) {
        let itemService = store.state.mode === 'projects' ? IntentService : IntentTemplateService
        return itemService.search(payload.projectId).then(result => {
            return context.commit(types.INTENT_LIST, result.data)
        })
    },
    [types.GET_ENTITY_TYPE_LIST] (context, payload) {
        let itemService = store.state.mode === 'projects' ? EntityTypeService : EntityTypeTemplateService
        return itemService.search(payload.projectId).then(result => {
            return context.commit(types.ENTITY_TYPE_LIST, result.data)
        })
    }
}

// basic actions
const ForwardToMutationList = [
    types.INTENT_LIST
]

const SetActionTypeList = []

applyBasicAction(actions, mutations, ForwardToMutationList, SetActionTypeList)

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
