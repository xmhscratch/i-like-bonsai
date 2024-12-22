export default (context) => {
    return (nodeId) => {
        const { db, rootId } = context
        return context.getDescendants(nodeId || rootId)
    }
}
