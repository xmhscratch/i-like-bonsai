import initSqlJs from 'sql.js'
// @ts-ignore
// import wasmSqlJsBuffer from 'sql.js/dist/sql-wasm.wasm'
import wasmSqlJsURL from 'sql.js/dist/sql-wasm.wasm?url'

import Tree from './tree' 

export async function __construct() {
    if (!window['SQLJS']) {
        // const wasmSqlJsBlob = new Blob(
        //     [new Uint8Array('sql.js/dist/sql-wasm.wasm?url')],
        //     { type: 'application/wasm' },
        // )
        // URL.createObjectURL(wasmSqlJsBlob)
        window['SQLJS'] = await initSqlJs
            .call(this, { locateFile: () => wasmSqlJsURL })
            .catch(console.error)
    }

    return window['SQLJS']
}

export default async function bonsai(rootNodeId?: String, data?: Object) {
    const SQLJS = await __construct()
    const tree = new Tree(rootNodeId)

    await tree.initialize(SQLJS)
    await tree.import(data)

    return tree
}
