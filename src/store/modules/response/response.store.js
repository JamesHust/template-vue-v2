import responseActionTypes from './response.type'
import applyBasicAction from '@/store/common.store'
import { ExtraResponseService } from '@/services/project.service'
import store from '@/store/store'
import { ExtraResponseTemplateService } from '@/services/template.service'

const types = responseActionTypes

const state = {
    extraResponseList: [],
    mapIdToExtraResponse: new Map()
}

const mutations = {
    [types.EXTRA_RESPONSE_LIST] (state, payload) {
        state.extraResponseList = payload
        state.mapIdToExtraResponse = new Map()
        state.extraResponseList.forEach(extraResponse => {
            state.mapIdToExtraResponse.set(extraResponse.id, extraResponse)
        })
    }
}

const actions = {
    [types.GET_EXTRA_RESPONSE_LIST] (context, payload) {
        if (!store) {
            return
        }
        if (store.state.mode === 'projects') {
            return ExtraResponseService.search(payload.projectId).then(result => {
                return context.commit(types.EXTRA_RESPONSE_LIST, result.data)
            })
        } else {
            return ExtraResponseTemplateService.search(payload.projectId).then(result => {
                return context.commit(types.EXTRA_RESPONSE_LIST, result.data)
            })
        }
    }
}

// basic actions
const ForwardToMutationList = [
    types.EXTRA_RESPONSE_LIST
]

const SetActionTypeList = [{
    actionType: types.EXTRA_RESPONSE_LIST,
    stateProperty: 'extraResponseList'
}]

applyBasicAction(actions, mutations, ForwardToMutationList, SetActionTypeList)

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
