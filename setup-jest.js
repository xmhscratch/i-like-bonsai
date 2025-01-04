import path from 'path'
import mock from 'mock-fs'
import initSqlJs from 'sql.js'

import Tree from './src/tree' 
import sampleTreeData from './test/tree.mock.json'

global.SQLJS = null
global.TREE = null
global.SAMPLE_TREE_DATA = sampleTreeData
global.ROOT_NODE_ID = "620244981c66ab7fbaac9122"

beforeAll(async () => {
    mock({
        'sql-wasm.wasm': mock.load(path.resolve(`./node_modules/`, 'sql.js/dist/sql-wasm.wasm')),
    })

    if (!global.SQLJS) {
        global.SQLJS = await initSqlJs
            .call(this, { locateFile: () => 'sql-wasm.wasm' })
            .catch(console.error)
    }
    mock.restore()
})

beforeEach(async () => {
    const tree = new Tree(global.ROOT_NODE_ID)

    await tree.initialize(global.SQLJS)
    await tree.import(global.SAMPLE_TREE_DATA)

    global.TREE = tree
})
