export default (context) => {
    return (nodeId) => {
        const { db, rootId } = context

        let stmt = db.prepare(`
            SELECT
                node.*
            FROM
                nodes AS node
            WHERE (
                node.id = $nodeId
                AND node.root = $rootId
            )
            LIMIT 1;
        `)
        let results = stmt.getAsObject({
            $nodeId: nodeId,
            $rootId: rootId,
        })
        stmt.free()

        return results
    }
}
