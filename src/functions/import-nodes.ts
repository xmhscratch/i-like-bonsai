import { map } from 'lodash-es'
import { Database, BindParams, SqlValue } from 'sql.js'

import {
    TreeInterface,
    TreeFuncContext,
    TreeFuncResult,
    TreePlainNode,
} from '../tree.d'

export default (context: TreeInterface): TreeFuncContext => {
    return (plainNodes?: Array<TreePlainNode>): TreeFuncResult => {
        const { db } = context

        db.run('DELETE FROM nodes;')

        return map(plainNodes, (item: TreePlainNode) => {
            db.run(`INSERT INTO nodes (
                id, root, parent, left, right, level
            ) VALUES (
                $nodeId, $rootId, $parentId, $left, $right, $level
            )`, <BindParams>{
                $nodeId:    <SqlValue>(item.id || item._id),
                $rootId:    <SqlValue>item.root,
                $parentId:  <SqlValue>item.parent,
                $left:      <SqlValue>item.left,
                $right:     <SqlValue>item.right,
                $level:     <SqlValue>item.level,
            })
        })
    }
}
