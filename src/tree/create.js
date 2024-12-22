import ObjectID from 'bson-objectid'
import { extend } from 'lodash-es'

export default (context) => {
    return (parentId) => {
        const { db } = context

        let nodeId = ObjectID().toHexString()
        let memo = { nodeId, parentId }

        let stmt = db.prepare(`
            SELECT
                node.root AS rootId
            FROM
                nodes AS node
            WHERE node.id = $parentId
            LIMIT 1;
        `)
        memo = extend({}, memo, stmt.getAsObject({
            $parentId: memo.parentId
        }))
        stmt.free()

        stmt = db.prepare(`
            INSERT INTO nodes (
                id, root, parent, left, right, level
            )
            VALUES (
                $nodeId, $rootId, $parentId, 0, 0, 0
            );
        `)
        stmt.run({
            $nodeId: memo.nodeId,
            $rootId: memo.rootId,
            $parentId: memo.parentId,
        })
        stmt.free()

        stmt = db.prepare(`
            SELECT
                node.left AS nodeLeft,
                node.right AS nodeRight
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
                node.right AS parentRight
            FROM
                nodes AS node
            WHERE (
                node.id = $parentId
                AND node.root = $rootId
            )
            LIMIT 1;
        `)
        memo = extend({}, memo, stmt.getAsObject({
            $parentId: memo.parentId,
            $rootId: memo.rootId
        }))
        stmt.free()

        stmt = db.prepare(`
            UPDATE nodes
            SET left = left + 2
            WHERE (
                left >= $parentRight
                AND root = $rootId
            );
        `)
        stmt.run({
            $parentRight: memo.parentRight,
            $rootId: memo.rootId
        })
        stmt.free()

        stmt = db.prepare(`
            UPDATE nodes
            SET right = right + 2
            WHERE (
                right >= $parentRight
                AND root = $rootId
            );
        `)
        stmt.run({
            $parentRight: memo.parentRight,
            $rootId: memo.rootId
        })
        stmt.free()

        stmt = db.prepare(`
            UPDATE nodes
            SET
                left = $parentRight,
                right = $parentRight + 1
            WHERE (
                id = $nodeId
                AND root = $rootId
            );
        `)
        stmt.run({
            $parentRight: memo.parentRight,
            $nodeId: memo.nodeId,
            $rootId: memo.rootId
        })
        stmt.free()

        stmt = db.prepare(`
            SELECT
                node.id,
                (COUNT(parent.id) - 1) AS nodeLevel
            FROM
                nodes AS node,
                nodes AS parent
            WHERE (
                (node.left BETWEEN parent.left AND parent.right)
                AND node.id = $nodeId
                AND parent.root = node.root
            )
            GROUP BY node.id;
        `)
        memo = extend({}, memo, stmt.getAsObject({
            $nodeId: memo.nodeId
        }))
        stmt.free()

        stmt = db.prepare(`
            UPDATE nodes
            SET level = $nodeLevel
            WHERE (
                id = $nodeId
                AND root = $rootId
            );
        `)
        stmt.run({
            $nodeLevel: memo.nodeLevel,
            $nodeId: memo.nodeId,
            $rootId: memo.rootId,
        })
        stmt.free()

        return { nodeId }
    }
}
