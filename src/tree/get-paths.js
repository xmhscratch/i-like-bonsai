import { extend } from 'lodash-es'

export default (context) => {
    return (nodeId) => {
        const { db } = context

        let stmt
        let memo = { nodeId }

        stmt = db.prepare(`
            SELECT
                node.root AS rootId
            FROM
                nodes AS node
            WHERE node.id = $nodeId
            LIMIT 1;
        `)
        memo = extend({}, memo, stmt.getAsObject({
            $nodeId: memo.nodeId
        }))
        stmt.free()

        stmt = db.prepare(`
            SELECT
                parent.*
            FROM
                nodes AS node,
                nodes AS parent
            WHERE (
                (node.left BETWEEN parent.left AND parent.right)
                AND node.id = $nodeId
                AND parent.root = $rootId
            )
            ORDER BY parent.left;
        `)
        stmt.bind({
            $nodeId: memo.nodeId,
            $rootId: memo.rootId
        })

        let results = []
        while (stmt.step()) {
            results.push(stmt.getAsObject())
        }
        stmt.free()

        return results
    }
}
