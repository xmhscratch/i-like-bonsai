import { test } from '@jest/globals'
import { expect } from '@jest/globals'

import resultRef from '../../test/get-paths.json'

test('getPaths', async () => {
    const nodeId = '620244981c66ab7fbaac9132'
    const result = await global.TREE.getPaths(nodeId)

    expect(result).toEqual(resultRef)
})
