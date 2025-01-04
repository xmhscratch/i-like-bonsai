import ObjectID from 'bson-objectid'
import hashObject from 'object-hash'
import { Database, SqlJsStatic, SqlValue, BindParams } from 'sql.js'
import {
    isEmpty,
    has,
    memoize,
    join,
    forEach,
} from 'lodash-es'

import getRootNode from './functions/get-root-node'
import getPaths from './functions/get-paths'
import createNode from './functions/create'
import getNode from './functions/get-node'
import getLevel from './functions/get-level'
import getDepth from './functions/get-depth'
import getIndexOf from './functions/get-index-of'
import getChildren from './functions/get-children'
import getDescendants from './functions/get-descendants'
import countChilds from './functions/count-childs'
import moveTo from './functions/move-to'
import deleteNode from './functions/delete'
import toAdjacencyList from './functions/to-adjacency-list'
import importNodes from './functions/import-nodes'
import toLinearList from './functions/to-linear-list'
import getPrevNode from './functions/get-prev-node'
import getNodeByParentIndex from './functions/get-node-parent-index'

import {
    TreeInterface,
    TreePlainNode,
} from './tree.d'

export const getNewID = (): String => ObjectID().toHexString()

export class Tree implements TreeInterface {

    static MODIFIER_FUNCTIONS = ['create', 'import', 'moveTo', 'delete']

    db: Database = null
    rootId: String = null

    _memoizer: Object = {}

    constructor(rootId?: String) {
        this.rootId = rootId
        return this
    }

    async initialize(SQLJS: SqlJsStatic) {
        let { rootId } = this
        if (isEmpty(rootId)) {
            rootId = getNewID()
            this.rootId = rootId
        }

        const db: Database = new SQLJS.Database()

        db.run(`CREATE TABLE nodes (
            id varchar(24) NOT NULL,
            root varchar(24) NOT NULL,
            parent varchar(24),
            left int(11) NOT NULL,
            right int(11) NOT NULL,
            level int(11) NOT NULL
        );`)
        db.run(`CREATE INDEX id ON nodes (id);`)
        db.run(`CREATE INDEX root ON nodes (root);`)
        db.run(`CREATE INDEX parent ON nodes (parent);`)
        db.run(`CREATE INDEX left ON nodes (left);`)
        db.run(`CREATE INDEX right ON nodes (right);`)

        db.run(`INSERT INTO nodes (
            id, root, parent, left, right, level
        ) VALUES (
            $rootId, $rootId, NULL, 1, 2, 0
        );`, <BindParams>{ $rootId: <SqlValue>rootId })

        this.db = db
        return this
    }

    async destroy() {
        return this.db.close()
    }

    getNewID(): String {
        return getNewID()
    }

    create = (...args) => this.memoize('create', createNode(this), args)
    import = (...args) => this.memoize('import', importNodes(this), args)
    moveTo = (...args) => this.memoize('moveTo', moveTo(this), args)
    delete = (...args) => this.memoize('delete', deleteNode(this), args)

    getNode = (...args) => this.memoize('getNode', getNode(this), args)
    getRootNode = (...args) => this.memoize('getRootNode', getRootNode(this), args)
    getPrevNode = (...args) => this.memoize('getPrevNode', getPrevNode(this), args)
    getNodeByParentIndex = (...args) => this.memoize('getNodeByParentIndex', getNodeByParentIndex(this), args)
    getPaths = (...args) => this.memoize('getPaths', getPaths(this), args)
    getLevel = (...args) => this.memoize('getLevel', getLevel(this), args)
    getDepth = (...args) => this.memoize('getDepth', getDepth(this), args)
    getIndexOf = (...args) => this.memoize('getIndexOf', getIndexOf(this), args)
    getChildren = (...args) => this.memoize('getChildren', getChildren(this), args)
    getDescendants = (...args) => this.memoize('getDescendants', getDescendants(this), args)
    countChilds = (...args) => this.memoize('countChilds', countChilds(this), args)
    toAdjacencyList = (...args) => this.memoize('toAdjacencyList', toAdjacencyList(this), args)
    toLinearList = (...args) => this.memoize('toLinearList', toLinearList(this), args)

    memoize(fnName, origFn, fnArgs) {
        let fnResult

        if (!has(this._memoizer, fnName)) {
            this._memoizer[fnName] = memoize(origFn, (fnArgs) => !isEmpty(fnArgs) ? hashObject(fnArgs) : fnName)
        }

        if ((new RegExp(`^(${join(Tree.MODIFIER_FUNCTIONS, '|')})$`, 'g')).test(fnName)) {
            forEach(this._memoizer, (v, k) => {
                if (has(this._memoizer, k)) {
                    (<any>this._memoizer[k]).cache.clear()
                }
            })
            fnResult = origFn.apply(this, fnArgs)
        }
        else {
            const memoFn = this._memoizer[fnName]
            fnResult = memoFn.apply(this, fnArgs)
        }

        return fnResult
    }
}

export default Tree
export type { TreeInterface, TreePlainNode }
