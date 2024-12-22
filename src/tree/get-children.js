import {
    extend,
    omit,
} from 'lodash-es'

export default (context) => {
    return (nodeId) => {
        const { db } = context

        let memo = { nodeId }

        let stmt = db.prepare(`
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
                node.*
            FROM
                nodes AS node
            WHERE (
                node.parent = $parentId
                AND node.root = $rootId
            )
            ORDER BY node.left;
        `)
        stmt.bind({
            $rootId: memo.rootId,
            $parentId: memo.nodeId,
        })

        let results = []
        while (stmt.step()) {
            let row = stmt.getAsObject()
            results.push(omit(row, 'nodeLevel'))
        }
        stmt.free()

        return results
    }
}

// stmt = db.prepare(`
//     SELECT
//         node.*,
//         (
//           COUNT(parent.id) - (subTree.nLevel + 1)
//         ) AS nodeLevel
//     FROM
//         nodes AS node,
//         nodes AS parent,
//         nodes AS subParent
//     INNER JOIN (
//         SELECT
//             node.id,
//             (COUNT(parent.id) - 1) AS nLevel
//         FROM
//             nodes AS node,
//             nodes AS parent
//         WHERE (node.left BETWEEN parent.left AND parent.right)
//             AND node.id = $nodeId
//             AND node.root = $rootId
//             AND parent.root = $rootId
//         GROUP BY node.id
//         ORDER BY node.left
//     ) AS subTree
//     WHERE (node.left BETWEEN parent.left AND parent.right)
//         AND (node.left BETWEEN subParent.left AND subParent.right)
//         AND subParent.id = subTree.id
//         AND subParent.root = $rootId
//         AND node.root = $rootId
//         AND parent.root = $rootId
//     GROUP BY node.id
//     HAVING nodeLevel = 1
//     ORDER BY node.left;
// `)
