import { describe, test } from '@jest/globals'
import { expect } from '@jest/globals'

describe('moveTo', () => {
    test.each([
        ['620244981c66ab7fbaac9136', '620244981c66ab7fbaac9126', null, 1],
        ['620244981c66ab7fbaac912e', '620244981c66ab7fbaac9126', null, 2],
        ['620244981c66ab7fbaac913a', '620244981c66ab7fbaac9122', -1, 3],
        // ['', '', null, 4],
        // ['', '620244981c66ab7fbaac9126', null, 5],
    ])('move node(%s) to parent node(%s)', async (nodeId, parentId, adjacencyId, step) => {
        const { default: resultRef } = await import(`../../test/move-to-${step}.json`)
        await global.TREE.moveTo(nodeId, parentId, adjacencyId)
        const treeSnapshot = await global.TREE.toLinearList()
        // const treeSnapshot1 = await global.TREE.toAdjacencyList()
        // console.log(JSON.stringify(treeSnapshot))
        expect(treeSnapshot).toEqual(resultRef)
    })
})
