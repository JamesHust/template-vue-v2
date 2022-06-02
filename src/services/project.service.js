import $http from '@/plugins/axios'
import BaseService from '@/modules/fptai/services/base.service'

export const ProjectUserRoleService = new BaseService('projects', 'user-roles')
export const ProjectConstantService = new BaseService('projects', 'constants')
export const EntityTypeService = new BaseService('projects', 'entity-types')
export const SampleService = new BaseService('projects', 'samples')
export const ExtraResponseService = new BaseService('projects', 'extra-responses')
export const ExtraResponseItemService = new BaseService('projects', 'extra-responses', 'items')

export const ProjectService = new BaseService('projects')
ProjectService.getOwner = (projectId) => {
    return $http.get(`projects/${projectId}/owner/`)
}
ProjectService.generateNewOTP = (projectId) => {
    return $http.post(`projects/${projectId}/otp/`)
}
ProjectService.getOTP = (projectId) => {
    return $http.get(`projects/${projectId}/otp/`)
}
ProjectService.createCacheNLPData = (projectId) => {
    return $http.get(`projects/${projectId}/nlp/create-cache/`)
}
ProjectService.downloadCacheNLPData = (projectId) => {
    return $http.get(`projects/${projectId}/nlp/download-cache/`)
}
ProjectService.getLastUpdatedCacheData = (projectId) => {
    return $http.get(`projects/${projectId}/nlp/last-updated-cache/`)
}
ProjectService.importProject = (projectId, data) => {
    return $http.post(`projects/${projectId}/import-project/`, data)
}
ProjectService.exportProject = (projectId, data) => {
    return $http.post(`projects/${projectId}/export-project/`, data)
}
ProjectService.delete = (projectId) => {
    return $http.delete(`projects/${projectId}`)
}

export const IntentService = new BaseService('projects', 'intents')
IntentService.updateSlots = (projectId, intentId, data) => {
    return $http.post(`projects/${projectId}/intents/${intentId}/slots/`, data)
}
IntentService.generateResponses = (projectId, intentId) => {
    return $http.post(`projects/${projectId}/intents/${intentId}/generate-responses/`)
}
IntentService.generateAllResponses = (projectId) => {
    return $http.post(`projects/${projectId}/generate-responses/`)
}

export const ResponseItemService = new BaseService('projects', 'response-items')
ResponseItemService.preview = (projectId, data) => {
    return $http.post(`projects/${projectId}/response-items/preview/`, data)
}
ResponseItemService.changePosition = (projectId, itemId, data) => {
    return $http.post(`projects/${projectId}/response-items/${itemId}/change-position/`, data)
}

export const GraphService = {
    getKBConfig (projectId) {
        return $http.get(`projects/${projectId}/kb-config/`)
    },
    updateKBConfig (projectId, data) {
        return $http.put(`projects/${projectId}/kb-config/`, data)
    },
    runQuery (projectId, query) {
        return $http.post(`projects/${projectId}/graph/execute-statement/`, {
            statement: query,
            result_data_contents: ['graph', 'row']
        })
    },
    startTrainingIntent (projectId) {
        return $http.post(`projects/${projectId}/nlp/start-training-intent/`)
    },
    getIntentTrainingStatus (projectId) {
        return $http.get(`projects/${projectId}/nlp/intent-training-status/`)
    },
    startTrainingEntity (projectId) {
        return $http.post(`projects/${projectId}/nlp/start-training-entity/`)
    },
    getEntityTrainingStatus (projectId) {
        return $http.get(`projects/${projectId}/nlp/entity-training-status/`)
    },
    getProjectToken (projectId) {
        return $http.get(`projects/${projectId}/token/`)
    },
    getRawQuery (projectId, simpleQuery) {
        return $http.post(`projects/${projectId}/simple-query/`, {
            simple_query: simpleQuery
        })
    },
    getAllGraphData (projectId) {
        return $http.get(`projects/${projectId}/graph/`)
    },
    saveLayout (projectId, data) {
        return $http.patch(`projects/${projectId}/graph/update-coordinates/`, { data })
    }
}

export const GraphNodeService = new BaseService('projects', 'graph/nodes')
GraphNodeService.getRelationships = (projectId, nodeId) => {
    return $http.get(`projects/${projectId}/graph/nodes/${nodeId}/relations/`)
}
GraphNodeService.addHyperedge = (projectId, model) => {
    return $http.post(`projects/${projectId}/graph/hyperedges/`, model)
}
GraphNodeService.cloneNode = (projectId, nodeKey) => {
    return $http.post(`projects/${projectId}/graph/clone-node/`, {
        original_node_key: nodeKey
    })
}

export const GraphRelationService = new BaseService('projects', 'graph/relations')
GraphRelationService.getTypes = function (projectId) {
    return $http.get(`projects/${projectId}/graph/relation-types/`)
}
