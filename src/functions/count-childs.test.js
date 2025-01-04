import { test } from '@jest/globals'
import { expect } from '@jest/globals'

test('countChilds', async () => {
  const result = await global.TREE.countChilds('620244981c66ab7fbaac913a')
  expect(result).toBe(4)
})
