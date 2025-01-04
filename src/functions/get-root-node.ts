import { Database, BindParams, SqlValue, Statement } from 'sql.js'

import {
    TreeInterface,
    TreeFuncContext,
    TreeFuncResult,
} from '../tree.d'

export default (context: TreeInterface): TreeFuncContext => {
    return (): TreeFuncResult => {
        const { db, rootId } = context

        const stmt: Statement = (<Database>db).prepare(`
            SELECT
                node.*
            FROM
                nodes AS node
            WHERE node.id = $nodeId
            LIMIT 1;
        `)
        const results = stmt.getAsObject(<BindParams>{
            $nodeId: <SqlValue>rootId,
        })
        stmt.free()

        return results
    }
}
