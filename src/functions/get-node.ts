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
                nodes AS node
            WHERE (
                node.id = $nodeId
                AND node.root = $rootId
            )
            LIMIT 1;
        `)
        let results = stmt.getAsObject(<BindParams>{
            $nodeId: <SqlValue>nodeId,
            $rootId: <SqlValue>rootId,
        })
        stmt.free()

        return results
    }
}
