import { test } from '@jest/globals'
import { expect } from '@jest/globals'

test('getDepth', async () => {
  const result = await global.TREE.getDepth('620244981c66ab7fbaac9126')
  expect(result).toBe(2)
})
