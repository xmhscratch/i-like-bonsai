import { test } from '@jest/globals'
import { expect } from '@jest/globals'

import resultRef from '../../test/delete.json'

test('delete', async () => {
    const nodeId = '620244981c66ab7fbaac9132'
    const result = await global.TREE.delete(nodeId)
    expect(result).toBeFalsy()

    const treeSnapshot = await global.TREE.toLinearList()
    expect(treeSnapshot).toEqual(resultRef)
})
