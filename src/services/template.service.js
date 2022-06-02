import $http from '@/plugins/axios'
import BaseService from '@/modules/fptai/services/base.service'

// base service
export const ProjectTemplateService = new BaseService('project-templates')
export const ProjectTemplateUserRoleService = new BaseService('project-templates', 'user-roles')
export const ConstantTemplateService = new BaseService('project-templates', 'constants')
export const ExtraResponseTemplateService = new BaseService('project-templates', 'extra-responses')
export const IntentTemplateService = new BaseService('project-templates', 'intents')
export const EntityTypeTemplateService = new BaseService('project-templates', 'entity-types')
export const SampleTemplateService = new BaseService('project-templates', 'samples')
export const ResponseItemTemplateService = new BaseService('project-templates', 'response-items')
// base graph
export const GraphNodeTemplateService = new BaseService('project-templates', 'graph/nodes')
export const GraphRelationTemplateService = new BaseService('project-templates', 'graph/relations')

// project
ProjectTemplateService.getOwner = (projectId) => {
    return $http.get(`project-templates/${projectId}/owner/`)
}
ProjectTemplateService.generateNewOTP = (projectId) => {
    return $http.post(`project-templates/${projectId}/otp/`)
}
ProjectTemplateService.getOTP = (projectId) => {
    return $http.get(`project-templates/${projectId}/otp/`)
}
ProjectTemplateService.createCacheNLPData = (projectId) => {
    return $http.get(`project-templates/${projectId}/nlp/create-cache/`)
}
ProjectTemplateService.downloadCacheNLPData = (projectId) => {
    return $http.get(`project-templates/${projectId}/nlp/download-cache/`)
}
ProjectTemplateService.getLastUpdatedCacheData = (projectId) => {
    return $http.get(`project-templates/${projectId}/nlp/last-updated-cache/`)
}
ProjectTemplateService.importProject = (projectId, data) => {
    return $http.post(`project-templates/${projectId}/import-project/`, data)
}
ProjectTemplateService.exportProject = (projectId, data) => {
    return $http.post(`project-templates/${projectId}/export-project/`, data)
}
ProjectTemplateService.delete = (projectId) => {
    return $http.delete(`project-templates/${projectId}`)
}

// response
ResponseItemTemplateService.preview = (projectId, data) => {
    return $http.post(`project-templates/${projectId}/response-items/preview/`, data)
}
ResponseItemTemplateService.changePosition = (projectId, itemId, data) => {
    return $http.post(`project-templates/${projectId}/response-items/${itemId}/change-position/`, data)
}

// intent
IntentTemplateService.updateSlots = (projectId, intentId, data) => {
    return $http.post(`project-templates/${projectId}/intents/${intentId}/slots/`, data)
}
IntentTemplateService.generateResponses = (projectId, intentId) => {
    return $http.post(`project-templates/${projectId}/intents/${intentId}/generate-responses/`)
}
IntentTemplateService.generateAllResponses = (projectId) => {
    return $http.post(`project-templates/${projectId}/generate-responses/`)
}

// graph
export const GraphTemplateService = {
    getKBConfig (projectId) {
        return $http.get(`project-templates/${projectId}/kb-config/`)
    },
    updateKBConfig (projectId, data) {
        return $http.put(`project-templates/${projectId}/kb-config/`, data)
    },
    runQuery (projectId, query) {
        return $http.post(`project-templates/${projectId}/graph/execute-statement/`, {
            statement: query,
            result_data_contents: ['graph', 'row']
        })
    },
    startTrainingIntent (projectId) {
        return $http.post(`project-templates/${projectId}/nlp/start-training-intent/`)
    },
    getIntentTrainingStatus (projectId) {
        return $http.get(`project-templates/${projectId}/nlp/intent-training-status/`)
    },
    startTrainingEntity (projectId) {
        return $http.post(`project-templates/${projectId}/nlp/start-training-entity/`)
    },
    getEntityTrainingStatus (projectId) {
        return $http.get(`project-templates/${projectId}/nlp/entity-training-status/`)
    },
    getProjectToken (projectId) {
        return $http.get(`project-templates/${projectId}/token/`)
    },
    getRawQuery (projectId, simpleQuery) {
        return $http.post(`project-templates/${projectId}/simple-query/`, {
            simple_query: simpleQuery
        })
    },
    getAllGraphData (projectId) {
        return $http.get(`project-templates/${projectId}/graph/`)
    },
    saveLayout (projectId, data) {
        return $http.patch(`project-templates/${projectId}/graph/update-coordinates/`, { data })
    }
}
GraphNodeTemplateService.getRelationships = (projectId, nodeId) => {
    return $http.get(`project-templates/${projectId}/graph/nodes/${nodeId}/relations/`)
}
GraphNodeTemplateService.addHyperedge = (projectId, model) => {
    return $http.post(`project-templates/${projectId}/graph/hyperedges/`, model)
}
GraphNodeTemplateService.cloneNode = (projectId, nodeKey) => {
    return $http.post(`project-templates/${projectId}/graph/clone-node/`, {
        original_node_key: nodeKey
    })
}
GraphRelationTemplateService.getTypes = function (projectId) {
    return $http.get(`project-templates/${projectId}/graph/relation-types/`)
}
