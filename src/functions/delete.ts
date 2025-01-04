import {
    extend,
    pickBy,
    identity,
    map,
    forEach,
} from 'lodash-es'
import { Database, BindParams, SqlValue, Statement } from 'sql.js'

import {
    TreeInterface,
    TreeFuncContext,
    TreeFuncResult,
} from '../tree.d'

export default (context: TreeInterface): TreeFuncContext => {
    return (nodeId): TreeFuncResult => {
        const { db } = context

        let stmt: Statement
        let memo: {
            nodeId: String,
            nodeLeft?: Number,
            nodeRight?: Number,
            rootId?: String,
            nodeWidth?: Number,
        } = { nodeId }

        stmt = (<Database>db).prepare(`
            SELECT
                node.id AS nodeId,
                node.root AS rootId,
                node.left AS nodeLeft,
                node.right AS nodeRight,
                (node.right - node.left + 1) AS nodeWidth
            FROM
                nodes as node
            WHERE (
                node.id = $nodeId
                AND node.parent IS NOT NULL
            );
        `)
        memo = extend({}, memo,
            pickBy(stmt.getAsObject(<BindParams>{ $nodeId: <SqlValue>nodeId }), identity)
        )
        stmt.free()

        if (!memo.nodeId) {
            return `Node ${memo.nodeId} does not exist`
        }

        const targetNodes = context.getDescendants(memo.nodeId)
        memo = extend({}, memo, { targetNodes })

        const nodeIds = map(targetNodes as Array<Object>, 'id')

        forEach(nodeIds, ($nodeId: SqlValue) => {
            stmt = (<Database>db).prepare(`
                DELETE FROM nodes
                WHERE id = $nodeId;
            `)
            stmt.run(<BindParams>{ $nodeId })
            stmt.free()
        })

        stmt = (<Database>db).prepare(`
            DELETE FROM nodes
            WHERE (
                left BETWEEN $nodeLeft AND $nodeRight
            )
            AND root = $rootId;
        `)
        stmt.run(<BindParams>{
            $nodeLeft:  <SqlValue>memo.nodeLeft,
            $nodeRight: <SqlValue>memo.nodeRight,
            $rootId:    <SqlValue>memo.rootId,
        })
        stmt.free()

        stmt = (<Database>db).prepare(`
            UPDATE
                nodes
            SET
                left = left - $nodeWidth
            WHERE left > $nodeRight
                AND root = $rootId;
        `)
        stmt.run(<BindParams>{
            $nodeWidth: <SqlValue>memo.nodeWidth,
            $nodeRight: <SqlValue>memo.nodeRight,
            $rootId:    <SqlValue>memo.rootId,
        })
        stmt.free()

        stmt = (<Database>db).prepare(`
            UPDATE
                nodes
            SET
                right = right - $nodeWidth
            WHERE right > $nodeRight
                AND root = $rootId;
        `)
        stmt.run(<BindParams>{
            $nodeWidth: <SqlValue>memo.nodeWidth,
            $nodeRight: <SqlValue>memo.nodeRight,
            $rootId:    <SqlValue>memo.rootId,
        })
        stmt.free()

        return null
    }
}
