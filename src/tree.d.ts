import { Database, SqlJsStatic } from 'sql.js'

export interface TreeFuncContext {}
export interface TreeFuncResult {}
export const TreeFuncArgs: Array<any>
export type TreePlainNode = {
    id: String,
    _id?: String,
    root: String,
    parent?: String,
    left: Number,
    right: Number,
    level: Number,
}

export interface TreeInterface {
    db: Database
    rootId: String
    _memoizer: Object

    initialize(SQLJS: SqlJsStatic)

    getNewID(): String

    create(TreeFuncArgs): TreeFuncContext
    import(TreeFuncArgs): TreeFuncContext
    moveTo(TreeFuncArgs): TreeFuncContext
    delete(TreeFuncArgs): TreeFuncContext

    getNode(TreeFuncArgs): TreeFuncContext
    getRootNode(TreeFuncArgs): TreeFuncContext
    getPrevNode(TreeFuncArgs): TreeFuncContext
    getNodeByParentIndex(TreeFuncArgs): TreeFuncContext
    getPaths(TreeFuncArgs): TreeFuncContext
    getLevel(TreeFuncArgs): TreeFuncContext
    getDepth(TreeFuncArgs): TreeFuncContext
    getIndexOf(TreeFuncArgs): TreeFuncContext
    getChildren(TreeFuncArgs): TreeFuncContext
    getDescendants(TreeFuncArgs): TreeFuncContext
    countChilds(TreeFuncArgs): TreeFuncContext
    toAdjacencyList(TreeFuncArgs): TreeFuncContext
    toLinearList(TreeFuncArgs): TreeFuncContext

    memoize(fnName: String, origFn: Function, fnArgs: any): TreeFuncResult
}
