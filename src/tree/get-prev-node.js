export default (context) => {
    return (nodeId) => {
        const { db, rootId } = context

        const nodeInfo = context.getNode(nodeId)
        const prevNodeParent = nodeInfo.parent
        const prevNodeRight = nodeInfo.left - 1

        let stmt

        stmt = db.prepare(`
            SELECT node.*
            FROM nodes as node
            WHERE node.root = $rootId
                AND node.right = $prevNodeRight
                AND node.parent = $prevNodeParent
            LIMIT 1;
        `)
        let results = stmt.getAsObject({
            $rootId: rootId,
            $prevNodeParent: prevNodeParent,
            $prevNodeRight: prevNodeRight,
        })
        stmt.free()

        return results
    }
}
