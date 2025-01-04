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
                node.*
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
        stmt.bind(<BindParams>{
            $nodeId: <SqlValue>nodeId,
            $rootId: <SqlValue>rootId,
        })

        let results = []
        while (stmt.step()) {
            results.push(stmt.getAsObject())
        }
        stmt.free()

        return results
    }
}
