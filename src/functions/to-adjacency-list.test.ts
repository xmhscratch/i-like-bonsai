import { test } from '@jest/globals'
import { expect } from '@jest/globals'

import resultRef from '../../test/to-adjacency-list.json'

test('toAdjacencyList', () => {
  const result = global.TREE.toAdjacencyList()
  // console.log(JSON.stringify(result))
  expect(result).toEqual(resultRef)
})
