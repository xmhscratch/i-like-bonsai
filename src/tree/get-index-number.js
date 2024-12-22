import { get } from 'lodash-es'

export default (context) => {
    return (nodeId) => {
        const { db, rootId } = context

        let stmt = db.prepare(`
            SELECT
                indexes.nodeId,
                indexes.nodeIndex
            FROM
                (
                    SELECT
                        node.id AS nodeId,
                        ROW_NUMBER () OVER ( 
                            ORDER BY node.left
                        ) AS nodeIndex
                    FROM
                        nodes AS node
                    WHERE (
                        node.root = $rootId
                    )
                ) AS indexes
            WHERE (
                indexes.nodeId = $nodeId
            )
            LIMIT 1;
        `)
        let results = stmt.getAsObject({
            $nodeId: nodeId,
            $rootId: rootId,
        })
        stmt.free()

        return get(results, 'nodeIndex', -1)
    }
}
