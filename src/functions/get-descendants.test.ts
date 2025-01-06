import { test } from '@jest/globals'
import { expect } from '@jest/globals'

import resultRef from '../../test/get-descendants.json'

test('getDescendants', async () => {
    const parentId = '620244981c66ab7fbaac9126'
    const result = await global.TREE.getDescendants(parentId)

    expect(result).toEqual(resultRef)
})
