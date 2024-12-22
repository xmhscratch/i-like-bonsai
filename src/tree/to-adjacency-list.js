import {
    isEmpty,
    forEach,
} from 'lodash-es'

export default (context) => {
    return (nodeId) => {
        const { db, rootId } = context

        const evalNodeChild = (node) => {
            const childNodes = context.getChildren(node.id)

            if (!isEmpty(childNodes)) {
                node.children = childNodes
            }

            forEach(childNodes, (node) => evalNodeChild(node))
            return node
        }

        const targetNode = context.getNode(nodeId || rootId)
        return evalNodeChild(targetNode)
    }
}
