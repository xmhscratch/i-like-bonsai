import { extend } from 'lodash-es'
import { Database, BindParams, SqlValue, Statement } from 'sql.js'

import {
    TreeInterface,
    TreeFuncContext,
    TreeFuncResult,
} from '../tree.d'

export default (context: TreeInterface): TreeFuncContext => {
    return (nodeId: String): TreeFuncResult => {
        const { db } = context

        let stmt: Statement
        let memo: {
            nodeId: String,
            rootId?: String,
        } = { nodeId }

        stmt = (<Database>db).prepare(`
            SELECT
                node.root AS rootId
            FROM
                nodes AS node
            WHERE node.id = $nodeId
            LIMIT 1;
        `)
        memo = extend({}, memo, stmt.getAsObject(<BindParams>{
            $nodeId: <SqlValue>memo.nodeId,
        }))
        stmt.free()

        stmt = (<Database>db).prepare(`
            SELECT
                parent.*
            FROM
                nodes AS node,
                nodes AS parent
            WHERE (
                (node.left BETWEEN parent.left AND parent.right)
                AND node.id = $nodeId
                AND parent.root = $rootId
            )
            ORDER BY parent.left;
        `)
        stmt.bind(<BindParams>{
            $nodeId: <SqlValue>memo.nodeId,
            $rootId: <SqlValue>memo.rootId,
        })

        let results = []
        while (stmt.step()) {
            results.push(stmt.getAsObject())
        }
        stmt.free()

        return results
    }
}
