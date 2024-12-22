import initSqlJs from 'sql.js'
import wasmSqlJsBuffer from 'sql.js/dist/sql-wasm.wasm'

import Tree from './tree'

async function __construct() {
    if (window['SQLJS']) { return }

    const wasmSqlJsBlob = new Blob([new Uint8Array(wasmSqlJsBuffer)], { type: 'application/wasm' })
    window['SQLJS'] = await initSqlJs
        .call(this, { locateFile: () => URL.createObjectURL(wasmSqlJsBlob) })
        .catch(console.error)
}

export default async (rootNodeId?: string, data?: object) => {
    const tree = new Tree(rootNodeId)

    await tree.initialize().catch(console.error)
    await tree.import(data).catch(console.error)

    return tree
}

__construct()
