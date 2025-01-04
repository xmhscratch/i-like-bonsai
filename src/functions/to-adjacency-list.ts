import {
    isEmpty,
    forEach,
    set,
} from 'lodash-es'

import {
    TreeInterface,
    TreeFuncContext,
    TreeFuncResult,
    TreePlainNode,
} from '../tree.d'

export default function (context: TreeInterface): TreeFuncContext {
    return (nodeId: String): TreeFuncResult => {
        const { db, rootId } = context

        const evalNodeChild = (node: TreePlainNode) => {
            const childNodes = context.getChildren(node.id)

            if (!isEmpty(childNodes)) {
                set(node, 'children', childNodes)
            }

            forEach(childNodes, (node: TreePlainNode) => evalNodeChild(node))
            return node
        }

        const targetNode = context.getNode(nodeId || rootId)
        return evalNodeChild(targetNode as TreePlainNode)
    }
}
