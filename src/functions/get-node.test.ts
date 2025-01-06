import { test } from '@jest/globals'
import { expect } from '@jest/globals'

test('getNode', async () => {
    const nodeId = '620244981c66ab7fbaac9132'
    const result = await global.TREE.getNode(nodeId)
    expect([result]).toContainEqual(
        expect.objectContaining({
            "id": "620244981c66ab7fbaac9132",
            "root": "620244981c66ab7fbaac9122",
            "parent": "620244981c66ab7fbaac9126",
            "left": 7,
            "right": 10,
            "level": 2
        })
    )
})
