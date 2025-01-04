import { isEmpty } from 'lodash-es'
import { Database, BindParams, SqlValue, Statement } from 'sql.js'

import {
    TreeInterface,
    TreeFuncContext,
    TreeFuncResult,
} from '../tree.d'

export default (context: TreeInterface): TreeFuncContext => {
    return (nodeId: String): TreeFuncResult => {
        const { db } = context

        let stmt: Statement = (<Database>db).prepare(`
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
        let results = stmt.getAsObject(<BindParams>{ $nodeId: <SqlValue>nodeId })
        stmt.free()

        return !isEmpty(results) ? results.level : 0
    }
}
