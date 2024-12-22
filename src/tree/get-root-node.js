export default (context) => {
    return () => {
        const { db, rootId } = context

        let stmt
    
        stmt = db.prepare(`
            SELECT
                node.*
            FROM
                nodes AS node
            WHERE node.id = $nodeId
            LIMIT 1;
        `)
        let results = stmt.getAsObject({
            $nodeId: rootId
        })
        stmt.free()

        return results
    }
}
