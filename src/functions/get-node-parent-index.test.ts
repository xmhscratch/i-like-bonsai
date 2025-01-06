import { test } from '@jest/globals'
import { expect } from '@jest/globals'

test('getNodeByParentIndex', async () => {
    const parentId = '620244981c66ab7fbaac9132'
    const result1 = await global.TREE.getNodeByParentIndex(parentId, 0)
    expect([result1]).toContainEqual(
        expect.objectContaining({
            id: '620244981c66ab7fbaac9136',
            root: '620244981c66ab7fbaac9122',
            parent: '620244981c66ab7fbaac9132',
            left: 8,
            right: 9,
            level: 3,
            parentIndex: 0
        })
    )
    const result2 = await global.TREE.getNodeByParentIndex(parentId, 100)
    expect(result2).toEqual({})
})
