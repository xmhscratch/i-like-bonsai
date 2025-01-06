import { get } from 'lodash-es'
import { Database, BindParams, SqlValue, Statement } from 'sql.js'

import {
    TreeInterface,
    TreeFuncContext,
    TreeFuncResult,
} from '../tree.d'

export default (context: TreeInterface): TreeFuncContext => {
    return (parentId: String, parentIndex: Number): TreeFuncResult => {
        const { db, rootId } = context

        let stmt: Statement = (<Database>db).prepare(`
            SELECT
                node.*,
                (
                    SELECT
                        COUNT(id)
                    FROM
                        nodes AS nthNode
                    WHERE (
                        nthNode.right < node.left
                        AND nthNode.parent = node.parent
                        AND nthNode.root = node.root
                    )
                ) AS parentIndex
            FROM
                nodes AS node
            WHERE (
                node.parent = $parentId
                AND node.root = $rootId
                AND parentIndex = $parentIndex
            )
            LIMIT 1;
        `)
        let results = stmt.getAsObject(<BindParams>{
            $rootId:        <SqlValue>rootId,
            $parentId:      <SqlValue>parentId,
            $parentIndex:   <SqlValue>parentIndex,
        })
        stmt.free()

        return get(results, 'id') ? results : {}
    }
}
