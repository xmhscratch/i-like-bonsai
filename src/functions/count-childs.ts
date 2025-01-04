import { isEmpty } from 'lodash-es'
import { Database, ParamsObject, BindParams, SqlValue } from 'sql.js'

import {
    TreeInterface,
    TreeFuncContext,
    TreeFuncResult,
} from '../tree.d'

export default (context: TreeInterface): TreeFuncContext => {
    return (nodeId: String): TreeFuncResult => {
        const { db, rootId } = context

        let stmt = (<Database>db).prepare(`
            SELECT
                COUNT(*) AS count
            FROM
                nodes AS child,
                (
                    SELECT
                        node.left AS left,
                        node.right AS right
                    FROM
                        nodes AS node
                    WHERE (
                        node.id = $nodeId
                        AND node.root = $rootId
                    )
                    LIMIT 1
                ) AS node
            WHERE (
                child.left BETWEEN node.left AND node.right
                AND child.right BETWEEN node.left AND node.right
                AND child.root = $rootId
            )
            LIMIT 1;
        `)
        let results = <ParamsObject>stmt.getAsObject(<BindParams>{
            $nodeId: <SqlValue>nodeId,
            $rootId: <SqlValue>rootId,
        })
        stmt.free()

        return !isEmpty(results) ? results.count : 0
    }
}
