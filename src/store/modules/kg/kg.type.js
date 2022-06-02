const kgActionTypes = {
    SHOULD_UPDATE_ACTIVE_NODE_RELATION: 'SHOULD_UPDATE_ACTIVE_NODE_RELATION',
    SHOULD_RUN_QUERY_AGAIN: 'SHOULD_RUN_QUERY_AGAIN',
    CLEAR_ALL_DATA: 'CLEAR_ALL_DATA',
    // active
    ACTIVE_NODE: 'ACTIVE_NODE',
    ACTIVE_RELATION: 'ACTIVE_RELATION',
    ACTIVE_ITEM: 'ACTIVE_ITEM',
    // kb config
    KB_CONFIG: 'KB_CONFIG',
    GET_KB_CONFIG: 'GET_KB_CONFIG',
    UPDATE_KB_CONFIG: 'UPDATE_KB_CONFIG',
    // node
    CREATE_NODE: 'CREATE_NODE',
    CLONE_NODE: 'CLONE_NODE',
    UPDATE_NODE: 'UPDATE_NODE',
    DELETE_NODE: 'DELETE_NODE',
    NODE_LIST: 'NODE_LIST',
    GET_NODE_LIST: 'GET_NODE_LIST',
    // relation
    CREATE_RELATION: 'CREATE_RELATION',
    UPDATE_RELATION: 'UPDATE_RELATION',
    DELETE_RELATION: 'DELETE_RELATION',
    // graph
    ADD_QUERY_HISTORY: 'ADD_QUERY_HISTORY',
    RELATION_TYPE_LIST: 'RELATION_TYPE_LIST',
    GET_RELATION_TYPE_LIST: 'GET_RELATION_TYPE_LIST',
    ADD_HYPEREDGE: 'ADD_HYPEREDGE',
    // graph view
    ADD_GRAPH_VIEW: 'ADD_GRAPH_VIEW',
    UPDATE_GRAPH_VIEW: 'UPDATE_GRAPH_VIEW',
    DELETE_GRAPH_VIEW: 'DELETE_GRAPH_VIEW',
    ACTIVE_GRAPH_VIEW_INDEX: 'ACTIVE_GRAPH_VIEW_INDEX',
    ACTIVE_GRAPH_VIEW_ID: 'ACTIVE_GRAPH_VIEW_ID'
}

export default kgActionTypes