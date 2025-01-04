import { isEmpty } from 'lodash-es'
import { Database, BindParams, SqlValue, Statement } from 'sql.js'

import {
    TreeInterface,
    TreeFuncContext,
    TreeFuncResult,
} from '../tree.d'

export default (context: TreeInterface): TreeFuncContext => {
    return (nodeId: String): TreeFuncResult => {
        const { db, rootId } = context

        let stmt: Statement = (<Database>db).prepare(`
            SELECT
                node.id,
                MAX(node.level - parent.level) AS depth
            FROM
                nodes AS node,
                nodes AS parent
            WHERE (
                    node.left BETWEEN parent.left
                    AND parent.right
                )
                AND parent.id = $nodeId
                AND node.root = $rootId
            ORDER BY node.left;
        `)
        let results = stmt.getAsObject(<BindParams>{
            $nodeId: <SqlValue>nodeId,
            $rootId: <SqlValue>rootId,
        })
        stmt.free()

        return !isEmpty(results) ? results.depth : 0
    }
}
