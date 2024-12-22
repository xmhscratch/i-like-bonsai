import { isEmpty } from 'lodash-es'

export default (context) => {
    return (nodeId) => {
        const { db, rootId } = context

        let stmt = db.prepare(`
            SELECT
                COUNT(*) AS count
            FROM
                nodes AS child,
                (
                    SELECT
                        node.left AS left,
                        node.right AS right
                    FROM
                        nodes AS node
                    WHERE (
                        node.id = $nodeId
                        AND node.root = $rootId
                    )
                    LIMIT 1
                ) AS node
            WHERE (
                child.left BETWEEN node.left AND node.right
                AND child.right BETWEEN node.left AND node.right
                AND child.root = $rootId
            )
            LIMIT 1;
        `)
        let results = stmt.getAsObject({
            $nodeId: nodeId,
            $rootId: rootId,
        })
        stmt.free()

        return !isEmpty(results) ? results.count : 0
    }
}
