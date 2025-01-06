import { test } from '@jest/globals'
import { expect } from '@jest/globals'

test('getRootNode', async () => {
    const nodeId = '620244981c66ab7fbaac9132'
    const result = await global.TREE.getRootNode(nodeId)

    expect([result]).toContainEqual(
        expect.objectContaining({
            "id": "620244981c66ab7fbaac9122",
            "root": "620244981c66ab7fbaac9122",
            "parent": null,
            "left": 1,
            "right": 20,
            "level": 0
        })
    )
})
