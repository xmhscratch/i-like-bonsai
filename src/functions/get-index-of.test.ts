import { test } from '@jest/globals'
import { expect } from '@jest/globals'

test('getIndexOf', async () => {
  const nodeId = '620244981c66ab7fbaac9132'
  const result = await global.TREE.getIndexOf(nodeId)
  expect(result).toBe(5)
})
