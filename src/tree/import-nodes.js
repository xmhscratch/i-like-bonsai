import { map } from 'lodash-es'

export default (context) => {
    return (plainNodes) => {
        const { db } = context

        db.run('DELETE FROM nodes;')

        return map(plainNodes, (item) => {
            db.run(`INSERT INTO nodes (
                id, root, parent, left, right, level
            ) VALUES (
                $nodeId, $rootId, $parentId, $left, $right, $level
            )`, {
                $nodeId: item.id || item._id,
                $rootId: item.root,
                $parentId: item.parent,
                $left: item.left,
                $right: item.right,
                $level: item.level,
            })
        })
    }
}
