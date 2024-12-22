import { isEmpty } from 'lodash-es'

export default (context) => {
    return (nodeId) => {
        const { db } = context

        let stmt = db.prepare(`
            SELECT
                node.id,
                (COUNT(parent.id) - 1) AS level
            FROM
                nodes AS node,
                nodes AS parent
            WHERE (
                node.id = $nodeId
                AND parent.root = node.root
                AND node.left BETWEEN parent.left AND parent.right
            )
            GROUP BY node.id;
        `)
        let results = stmt.getAsObject({ $nodeId: nodeId })
        stmt.free()

        return !isEmpty(results) ? results.level : 0
    }
}
