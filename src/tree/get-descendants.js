export default (context) => {
    return (nodeId) => {
        const { db, rootId } = context

        let stmt = db.prepare(`
            SELECT
                node.*
            FROM
                nodes AS node,
                nodes AS parent
            WHERE (
                    node.left BETWEEN parent.left
                    AND parent.right
                )
                AND parent.id = $nodeId
                AND node.root = $rootId
            ORDER BY node.left;
        `)
        stmt.bind({
            $nodeId: nodeId,
            $rootId: rootId,
        })

        let results = []
        while (stmt.step()) {
            results.push(stmt.getAsObject())
        }
        stmt.free()

        return results
    }
}
