import { get } from 'lodash-es'
import { Database, BindParams, SqlValue, Statement } from 'sql.js'

import {
    TreeInterface,
    TreeFuncContext,
    TreeFuncResult,
} from '../tree.d'

export default (context: TreeInterface): TreeFuncContext => {
    return (nodeId: String): TreeFuncResult => {
        const { db, rootId } = context

        const nodeInfo = context.getNode(nodeId)
        const prevNodeParent = get(nodeInfo, 'parent', null)
        const prevNodeRight = get(nodeInfo, 'left', 2) - 1

        const stmt: Statement = (<Database>db).prepare(`
            SELECT node.*
            FROM nodes as node
            WHERE node.root = $rootId
                AND node.right = $prevNodeRight
                AND node.parent = $prevNodeParent
            LIMIT 1;
        `)
        const results = stmt.getAsObject(<BindParams>{
            $rootId:            <SqlValue>rootId,
            $prevNodeParent:    <SqlValue>prevNodeParent,
            $prevNodeRight:     <SqlValue>prevNodeRight,
        })
        stmt.free()

        return results
    }
}
