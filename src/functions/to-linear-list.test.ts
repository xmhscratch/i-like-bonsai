import { test } from '@jest/globals'
import { expect } from '@jest/globals'

import resultRef from '../../test/to-linear-list.json'

test('toLinearList', () => {
  const result = global.TREE.toLinearList()
  // console.log(JSON.stringify(result))
  expect(result).toEqual(resultRef)
})
