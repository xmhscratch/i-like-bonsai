import { isEmpty } from 'lodash-es'

export default (context) => {
    return (nodeId) => {
        const { db, rootId } = context

        let stmt = db.prepare(`
            SELECT
                node.id,
                MAX(node.level - parent.level) AS depth
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
        let results = stmt.getAsObject({
            $nodeId: nodeId,
            $rootId: rootId
        })
        stmt.free()

        return !isEmpty(results) ? results.depth : 0
    }
}
