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

        let stmt: Statement = (<Database>db).prepare(`
            SELECT
                indexes.nodeId,
                indexes.nodeIndex
            FROM
                (
                    SELECT
                        node.id AS nodeId,
                        ROW_NUMBER () OVER ( 
                            ORDER BY node.left
                        ) AS nodeIndex
                    FROM
                        nodes AS node
                    WHERE (
                        node.root = $rootId
                    )
                ) AS indexes
            WHERE (
                indexes.nodeId = $nodeId
            )
            LIMIT 1;
        `)
        let results = stmt.getAsObject(<BindParams>{
            $nodeId: <SqlValue>nodeId,
            $rootId: <SqlValue>rootId,
        })
        stmt.free()

        return get(results, 'nodeIndex', -1)
    }
}
