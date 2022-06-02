function applyBasicAction (actions, mutations, ForwardToMutationList, SetActionTypeList) {
    ForwardToMutationList.forEach(actionType => {
        actions[actionType] = (context, payload) => context.commit(actionType, payload)
    })

    SetActionTypeList.forEach(item => {
        mutations[item.actionType] = (state, payload) => {
            state[item.stateProperty] = payload
        }
        actions[item.actionType] = (context, payload) => context.commit(item.actionType, payload)
    })
}

export default applyBasicAction
