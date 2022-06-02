import Vue from 'vue'

const env = {
    DEV: 'development',
    STA: 'staging',
    PRO: 'production',
    DEMO: 'demo'
}

const AuthenticationService = {
    SELF: 'SELF',
    FPT_ID: 'FPT_ID'
}

export const OPEN_ID_CONFIG_PATH = '/.well-known/openid-configuration/'

// Project List Context Menu Action
export const PROJECT_LIST_CMA = {
    DELETE_PROJECT: 'delete_project'
}

// Graph Visual Context Menu Action
export const GRAPH_VISUAL_CMA = {
    EXPAND: 'EXPAND',
    DELETE: 'DELETE',
    ADD_RELATION_TO: 'ADD_RELATION_TO',
    ADD_HYPEREDGE: 'ADD_HYPEREDGE',
    EDIT_NODE: 'EDIT_NODE',
    CLONE_NODE: 'CLONE_NODE'
}

// Graph Node List Context Menu Action
export const GRAPH_NODE_LIST_CMA = {
    ACTIVE_NODE: 'active_node',
    CREATE_QUERY: 'create_query'
}

// Graph View
export const GRAPH_VIEW_TYPE = {
    QUERY: 'QUERY',
    ALL: 'ALL'
}

export const GRAPH_QUERY_TYPE = {
    RAW: 'raw',
    SIMPLE: 'simple'
}

export const GRAPH_QUERY_RESULT_VIEW_TYPE = {
    GRAPH: 'GRAPH',
    TABLE: 'TABLE'
}

export const INTENT_SLOT_TYPE = {
    REQUIRED: 'REQUIRED',
    OPTIONAL: 'OPTIONAL'
}

export const ROLE_PERMISSION = {
    ADMIN: 'ADMIN',
    DATA_EDITOR: 'DATA_EDITOR',
    TESTER: 'TESTER',
    VIEWER: 'VIEWER'
}

const $const = {
    env,
    AuthenticationService,
    OPEN_ID_CONFIG_PATH,
    TOKEN_KEY: 'jwToken',
    LANGUAGE: 'LANGUAGE',
    DATE_FORMAT: 'YYYY-MM-DD',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
    itemPerPage: 15,
    perPageArray: [10, 15, 30, 50, 100],
    sortBy: 'title',
    sortDirection: 'asc'
}

Vue.prototype.$const = $const

export default $const
