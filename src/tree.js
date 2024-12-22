import ObjectID from 'bson-objectid'
import hashObject from 'object-hash'
import {
    isEmpty,
    has,
    memoize,
    join,
    forEach,
} from 'lodash-es'

import getRootNode from './tree/get-root-node'
import getPaths from './tree/get-paths'
import createNode from './tree/create'
import getNode from './tree/get-node'
import getLevel from './tree/get-level'
import getDepth from './tree/get-depth'
import getIndexNumber from './tree/get-index-number'
import getChildren from './tree/get-children'
import getDescendants from './tree/get-descendants'
import countChilds from './tree/count-childs'
import moveTo from './tree/move-to'
import deleteNode from './tree/delete'
import toAdjacencyList from './tree/to-adjacency-list'
import importNodes from './tree/import-nodes'
import toLinearList from './tree/to-linear-list'
import getPrevNode from './tree/get-prev-node'
import getNodeByParentIndex from './tree/get-node-parent-index'

export default class Tree {

    static MODIFIER_FUNCTIONS = ['create', 'import', 'moveTo', 'delete']
    // static GETTER_FUNCTIONS = [
    //     'getNode',
    //     'getRootNode',
    //     'getPrevNode',
    //     'getNodeByParentIndex',
    //     'getPaths',
    //     'getLevel',
    //     'getDepth',
    //     'getIndexNumber',
    //     'getChildren',
    //     'getDescendants',
    //     'countChilds',
    //     'toAdjacencyList',
    //     'toLinearList',
    // ]

    db = null
    rootId = null

    _memoizer = {}

    constructor(rootId) {
        this.rootId = rootId
        return this
    }

    async initialize() {
        let { rootId } = this
        if (isEmpty(rootId)) {
            rootId = ObjectID().toHexString()
            this.rootId = rootId
        }

        const { SQL } = window
        const db = new SQL.Database()

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
        );`, { $rootId: rootId })

        this.db = db
        return this
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
    getIndexNumber = (...args) => this.memoize('getIndexNumber', getIndexNumber(this), args)
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
                    this._memoizer[k].cache.clear()
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