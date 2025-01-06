import { test } from '@jest/globals'
import { expect } from '@jest/globals'

test('getLevel', async () => {
    const nodeId = '620244981c66ab7fbaac9132'
    const result = await global.TREE.getLevel(nodeId)
    expect(result).toBe(2)
})
