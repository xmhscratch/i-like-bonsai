import { test } from '@jest/globals'
import { expect } from '@jest/globals'

test('getPrevNode', async () => {
    const nodeId = '620244981c66ab7fbaac9132'
    const result = await global.TREE.getPrevNode(nodeId)

    expect([result]).toContainEqual(
        expect.objectContaining({
            "id": "620244981c66ab7fbaac912a",
            "root": "620244981c66ab7fbaac9122",
            "parent": "620244981c66ab7fbaac9126",
            "left": 3,
            "right": 6,
            "level": 2
        })
    )
})
