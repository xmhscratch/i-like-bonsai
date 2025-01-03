import {
    extend,
    isEqual,
} from 'lodash-es'

export default (context) => {
    return (nodeId, parentId, adjacentId = null) => {
        const { db } = context

        let stmt
        let memo = { nodeId, parentId, adjacentId }

        if (isEqual(nodeId, parentId)) {
            return true
        }

        stmt = db.prepare(`
            SELECT
                node.root AS rootId,
                node.left AS nodeLeft,
                node.right AS nodeRight,
                node.level AS nodeLevel,
                node.right - node.left + 1 AS nodeWidth
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
                node.left AS parentLeft,
                node.right AS parentRight,
                node.level AS parentLevel
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

        if (adjacentId) {
            stmt = db.prepare(`
                SELECT
                    parent.id AS adjacentId,
                    parent.left AS adjacentLeft,
                    parent.right AS adjacentRight,
                    parent.right AS newPosition
                FROM
                    nodes AS node,
                    nodes AS parent
                WHERE (
                    node.id = $adjacentId
                    AND node.left BETWEEN parent.left AND parent.right
                    AND node.root = $rootId
                    AND parent.level = $parentLevel + 1
                )
                LIMIT 1;
            `)
            memo = extend({}, memo, stmt.getAsObject({
                $parentLevel: memo.parentLevel,
                $adjacentId: memo.adjacentId,
                $rootId: memo.rootId
            }))
            stmt.free()
        }

        if (!memo.newPosition) {
            memo.newPosition = memo.parentLeft
        }

        stmt = db.prepare(`
            UPDATE nodes
            SET
                left = 0 - left,
                right = 0 - right
            WHERE (
                left >= $nodeLeft
                AND right <= $nodeRight
                AND root = $rootId
            );
        `)
        stmt.run({
            $nodeLeft: memo.nodeLeft,
            $nodeRight: memo.nodeRight,
            $rootId: memo.rootId
        })
        stmt.free()

        stmt = db.prepare(`
            UPDATE nodes
            SET left = left - $nodeWidth
            WHERE (
                left > $nodeRight
                AND root = $rootId
            );
        `)
        stmt.run({
            $nodeWidth: memo.nodeWidth,
            $nodeRight: memo.nodeRight,
            $rootId: memo.rootId
        })
        stmt.free()

        stmt = db.prepare(`
            UPDATE nodes
            SET right = right - $nodeWidth
            WHERE (
                right > $nodeRight
                AND root = $rootId
            );
        `)
        stmt.run({
            $nodeWidth: memo.nodeWidth,
            $nodeRight: memo.nodeRight,
            $rootId: memo.rootId
        })
        stmt.free()

        stmt = db.prepare(`
            UPDATE nodes
            SET left = left + $nodeWidth
            WHERE (
                CASE WHEN $newPosition > $nodeRight
                    THEN left > ($newPosition - $nodeWidth)
                    ELSE left > $newPosition
                END
            )
            AND root = $rootId;
        `)
        stmt.run({
            $nodeWidth: memo.nodeWidth,
            $newPosition: memo.newPosition,
            $nodeRight: memo.nodeRight,
            $rootId: memo.rootId
        })
        stmt.free()

        stmt = db.prepare(`
            UPDATE nodes
            SET right = right + $nodeWidth
            WHERE (
                CASE WHEN $newPosition > $nodeRight
                    THEN right > ($newPosition - $nodeWidth)
                    ELSE right > $newPosition
                END
            )
            AND root = $rootId;
        `)
        stmt.run({
            $nodeWidth: memo.nodeWidth,
            $newPosition: memo.newPosition,
            $nodeRight: memo.nodeRight,
            $rootId: memo.rootId
        })
        stmt.free()

        stmt = db.prepare(`
            UPDATE nodes
            SET
                left = CASE WHEN $newPosition > $nodeRight
                    THEN 0 - left + ($newPosition - $nodeRight)
                    ELSE 0 - left + ($newPosition - $nodeRight + $nodeWidth)
                END,
                right = CASE WHEN $newPosition > $nodeRight
                    THEN 0 - right + ($newPosition - $nodeRight)
                    ELSE 0 - right + ($newPosition - $nodeRight + $nodeWidth)
                END,
                level = level + ($parentLevel - ($nodeLevel - 1))
            WHERE left <= 0 - $nodeLeft
                AND right >= 0 - $nodeRight
                AND root = $rootId;
        `)
        stmt.run({
            $nodeWidth: memo.nodeWidth,
            $newPosition: memo.newPosition,
            $nodeLeft: memo.nodeLeft,
            $nodeRight: memo.nodeRight,
            $parentLevel: memo.parentLevel,
            $nodeLevel: memo.nodeLevel,
            $rootId: memo.rootId
        })
        stmt.free()

        stmt = db.prepare(`
            UPDATE nodes
            SET parent = $parentId
            WHERE id = $nodeId
                AND root = $rootId;
        `)
        stmt.run({
            $parentId: memo.parentId,
            $nodeId: memo.nodeId,
            $rootId: memo.rootId
        })
        stmt.free()

        return true
    }
}
