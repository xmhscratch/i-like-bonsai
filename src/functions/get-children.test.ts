import { test } from '@jest/globals'
import { expect } from '@jest/globals'

import resultRef from '../../test/get-children.json'

test('getChildren', async () => {
    const parentId = '620244981c66ab7fbaac9126'
    const result = await global.TREE.getChildren(parentId)

    expect(result).toEqual(resultRef)
})
