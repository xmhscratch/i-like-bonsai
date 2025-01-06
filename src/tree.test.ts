import { test } from '@jest/globals'
import { expect } from '@jest/globals'
import ObjectID from 'bson-objectid'

test('tree.getNewID', async () => {
    const result = await global.TREE.getNewID()
    expect(result).toHaveLength(24)
    expect(ObjectID.isValid(result)).toBeTruthy()
})
