'use strict'

const { expect } = require('chai')
const { countTagsInObject } = require('../app/utils/tagUtils')

function expectCountHelper (tagsToCount, data, count = {}, expectedOutput) {
  const output = countTagsInObject(tagsToCount, data, count)
  expect(output).to.eql(expectedOutput)

  return output
}

describe('tagUtils', () => {
  describe('#countTagsInObject()', () => {
    const invalidValues = [
      { tags: undefined, data: undefined },
      { tags: null, data: undefined },
      { tags: 'foo', data: undefined },
      { tags: { foo: 'bar' }, data: undefined },
      { tags: [ 'foo' ], data: undefined },
      { tags: [ 'foo' ], data: 'bar' },
      { tags: [ 'foo' ], data: [ 'bar' ] }
    ]
    invalidValues.forEach((testCase, key) => {
      const { tags, data } = testCase
      it(`should throw error on invalid input ${key + 1} (${JSON.stringify(testCase)})`, () => {
        expect(() => countTagsInObject(tags, data)).to.throw(Error)
      })
    })

    it('should return the correct tag count', () => {
      const dataObject1 = {
        tags: [ 'foo', 'fooo', 'bar', 'lore' ],
        children: [
          { tags: [ 'foo', 'bar', 'bar', 'lore' ] }
        ]
      }
      const dataObject2 = {
        tags: [ 'foo', 'lorem' ],
        children: [
          { tags: [ 'lore' ] }
        ]
      }
      expectCountHelper(['lala'], dataObject1, undefined, { lala: 0 })
      expectCountHelper(['foo'], dataObject1, undefined, { foo: 2 })
      expectCountHelper(['fooo'], dataObject1, undefined, { fooo: 1 })
      expectCountHelper(['bar'], dataObject1, undefined, { bar: 2 })

      const count = expectCountHelper(['foo', 'bar'], dataObject1, undefined, { foo: 2, bar: 2 })
      expectCountHelper(['lorem', 'foo', 'fooo'], dataObject2, count, { foo: 3, bar: 2, lorem: 1, fooo: 0 })

      // expect(countTagsInObject([''])).to.eql([])
      // expect(countTagsInObject(['foo ', 'foo', ''])).to.eql([ 'foo' ])
      // expect(countTagsInObject(['foo', '', 'bar', '', 'bar'])).to.eql([ 'foo', 'bar' ])
    })
  })
})
