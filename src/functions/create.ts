import { extend } from 'lodash-es'
import { Database, BindParams, SqlValue } from 'sql.js'

import {
    TreeInterface,
    TreeFuncContext,
    TreeFuncResult,
} from '../tree.d'

export default (context: TreeInterface): TreeFuncContext => {
    return (parentId: String): TreeFuncResult => {
        const { db } = context

        let nodeId = context.getNewID()
        let memo: {
            nodeId: String,
            parentId: String,
            rootId?: String,
            parentRight?: Number,
            nodeLevel?: Number,
        } = { nodeId, parentId }

        let stmt = (<Database>db).prepare(`
            SELECT
                node.root AS rootId
            FROM
                nodes AS node
            WHERE node.id = $parentId
            LIMIT 1;
        `)
        memo = extend({}, memo, stmt.getAsObject(<BindParams>{
            $parentId: <SqlValue>memo.parentId,
        }))
        stmt.free()

        stmt = (<Database>db).prepare(`
            INSERT INTO nodes (
                id, root, parent, left, right, level
            )
            VALUES (
                $nodeId, $rootId, $parentId, 0, 0, 0
            );
        `)
        stmt.run(<BindParams>{
            $nodeId:    <SqlValue>memo.nodeId,
            $rootId:    <SqlValue>memo.rootId,
            $parentId:  <SqlValue>memo.parentId,
        })
        stmt.free()

        stmt = (<Database>db).prepare(`
            SELECT
                node.left AS nodeLeft,
                node.right AS nodeRight
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
                node.right AS parentRight
            FROM
                nodes AS node
            WHERE (
                node.id = $parentId
                AND node.root = $rootId
            )
            LIMIT 1;
        `)
        memo = extend({}, memo, stmt.getAsObject(<BindParams>{
            $parentId:  <SqlValue>memo.parentId,
            $rootId:    <SqlValue>memo.rootId,
        }))
        stmt.free()

        stmt = (<Database>db).prepare(`
            UPDATE nodes
            SET left = left + 2
            WHERE (
                left >= $parentRight
                AND root = $rootId
            );
        `)
        stmt.run(<BindParams>{
            $parentRight:   <SqlValue>memo.parentRight,
            $rootId:        <SqlValue>memo.rootId,
        })
        stmt.free()

        stmt = (<Database>db).prepare(`
            UPDATE nodes
            SET right = right + 2
            WHERE (
                right >= $parentRight
                AND root = $rootId
            );
        `)
        stmt.run(<BindParams>{
            $parentRight:   <SqlValue>memo.parentRight,
            $rootId:        <SqlValue>memo.rootId,
        })
        stmt.free()

        stmt = (<Database>db).prepare(`
            UPDATE nodes
            SET
                left = $parentRight,
                right = $parentRight + 1
            WHERE (
                id = $nodeId
                AND root = $rootId
            );
        `)
        stmt.run(<BindParams>{
            $parentRight:   <SqlValue>memo.parentRight,
            $nodeId:        <SqlValue>memo.nodeId,
            $rootId:        <SqlValue>memo.rootId,
        })
        stmt.free()

        stmt = (<Database>db).prepare(`
            SELECT
                node.id,
                (COUNT(parent.id) - 1) AS nodeLevel
            FROM
                nodes AS node,
                nodes AS parent
            WHERE (
                (node.left BETWEEN parent.left AND parent.right)
                AND node.id = $nodeId
                AND parent.root = node.root
            )
            GROUP BY node.id;
        `)
        memo = extend({}, memo, stmt.getAsObject(<BindParams>{
            $nodeId: <SqlValue>memo.nodeId,
        }))
        stmt.free()

        stmt = (<Database>db).prepare(`
            UPDATE nodes
            SET level = $nodeLevel
            WHERE (
                id = $nodeId
                AND root = $rootId
            );
        `)
        stmt.run(<BindParams>{
            $nodeLevel: <SqlValue>memo.nodeLevel,
            $nodeId:    <SqlValue>memo.nodeId,
            $rootId:    <SqlValue>memo.rootId,
        })
        stmt.free()

        return { nodeId }
    }
}
