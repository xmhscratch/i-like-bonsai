import {
    extend,
    pickBy,
    identity,
    map,
    forEach,
} from 'lodash-es'

export default (context) => {
    return (nodeId) => {
        const { db } = context

        let stmt
        let memo = {}

        stmt = db.prepare(`
            SELECT
                node.id AS nodeId,
                node.root AS rootId,
                node.left AS nodeLeft,
                node.right AS nodeRight,
                (node.right - node.left + 1) AS nodeWidth
            FROM
                nodes as node
            WHERE (
                node.id = $nodeId
                AND node.parent IS NOT NULL
            );
        `)
        memo = extend({}, memo,
            pickBy(stmt.getAsObject({ $nodeId: nodeId }), identity)
        )
        stmt.free()

        if (!memo.nodeId) {
            return t(`Node ${memo.nodeId} doesnt exist`)
        }

        const targetNodes = context.getDescendants(memo.nodeId)
        memo = extend({}, memo, { targetNodes })

        const nodeIds = map(targetNodes, 'id')

        forEach(nodeIds, ($nodeId) => {
            stmt = db.prepare(`
                DELETE FROM nodes
                WHERE id = $nodeId;
            `)
            stmt.run({ $nodeId })
            stmt.free()
        })

        stmt = db.prepare(`
            DELETE FROM nodes
            WHERE (
                left BETWEEN $nodeLeft AND $nodeRight
            )
            AND root = $rootId;
        `)
        stmt.run({
            $nodeLeft: memo.nodeLeft,
            $nodeRight: memo.nodeRight,
            $rootId: memo.rootId
        })
        stmt.free()

        stmt = db.prepare(`
            UPDATE
                nodes
            SET
                left = left - $nodeWidth
            WHERE left > $nodeRight
                AND root = $rootId;
        `)
        stmt.run({
            $nodeWidth: memo.nodeWidth,
            $nodeRight: memo.nodeRight,
            $rootId: memo.rootId,
        })
        stmt.free()

        stmt = db.prepare(`
            UPDATE
                nodes
            SET
                right = right - $nodeWidth
            WHERE right > $nodeRight
                AND root = $rootId;
        `)
        stmt.run({
            $nodeWidth: memo.nodeWidth,
            $nodeRight: memo.nodeRight,
            $rootId: memo.rootId,
        })
        stmt.free()

        return null
    }
}
