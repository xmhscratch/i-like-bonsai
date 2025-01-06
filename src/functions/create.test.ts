import { test } from '@jest/globals'
import { expect } from '@jest/globals'
import ObjectID from 'bson-objectid'

test('create', async () => {
    const parentId = '620244981c66ab7fbaac9132'
    const result = await global.TREE.create(parentId)
    expect(result).toHaveProperty('nodeId')

    const newId = result.nodeId
    expect(ObjectID.isValid(newId)).toBeTruthy()

    const treeSnapshot = global.TREE.toLinearList()
    expect(treeSnapshot).toContainEqual(
        expect.objectContaining({
            "root": "620244981c66ab7fbaac9122",
            "parent": "620244981c66ab7fbaac9132",
            "left": 10,
            "right": 11,
            "level": 3
        })
    )
})
