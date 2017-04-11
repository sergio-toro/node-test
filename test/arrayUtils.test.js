'use strict'

const { expect } = require('chai')
const { uniqueList, stringListToArray, filterRegExp } = require('../app/utils/arrayUtils')

describe('arrayUtils', () => {
  describe('#uniqueList()', () => {
    const invalidCases = [
      undefined,
      null,
      'foo',
      { foo: 'bar' }
    ]
    invalidCases.forEach((testCase, key) => {
      it(`should throw error on invalid input ${key + 1} (${JSON.stringify(testCase)})`, () => {
        expect(() => uniqueList(testCase)).to.throw(Error)
      })
    })

    it('should return a unique list', () => {
      expect(uniqueList([])).to.eql([])
      expect(uniqueList([''])).to.eql([])
      expect(uniqueList(['foo ', 'foo', ''])).to.eql([ 'foo' ])
      expect(uniqueList(['foo', '', 'bar', '', 'bar'])).to.eql([ 'foo', 'bar' ])
    })
  })

  describe('#stringListToArray()', () => {
    it('should parse a single value', () => {
      expect(stringListToArray('foo')).to.eql([ 'foo' ])
    })
    it('should parse comma separated string value', () => {
      expect(stringListToArray(' foo,bar,baz')).to.eql([ 'foo', 'bar', 'baz' ])
      expect(stringListToArray('foo, bar,')).to.eql([ 'foo', 'bar', '' ])
      expect(stringListToArray('foo,foo,bar ')).to.eql([ 'foo', 'foo', 'bar' ])
      expect(stringListToArray(',foo,')).to.eql([ '', 'foo', '' ])
    })
    it('should parse new-line separated string value', () => {
      expect(stringListToArray(' foo\nbar\nbaz')).to.eql([ 'foo', 'bar', 'baz' ])
      expect(stringListToArray('foo\n bar\n')).to.eql([ 'foo', 'bar', '' ])
      expect(stringListToArray('foo\nfoo\nbar ')).to.eql([ 'foo', 'foo', 'bar' ])
      expect(stringListToArray('\nfoo\n')).to.eql([ '', 'foo', '' ])
    })
  })

  describe('#filterRegExp()', () => {
    const invalidCases = [
      { items: undefined, regExp: undefined },
      { items: null, regExp: undefined },
      { items: 'foo', regExp: undefined },
      { items: { foo: 'bar' }, regExp: undefined },
      { items: [], regExp: null },
      { items: [], regExp: 'bar' },
      { items: [], regExp: [ 'bar' ] },
      { items: [], regExp: '*.json' }
    ]
    invalidCases.forEach((testCase, key) => {
      it(`should throw error on invalid input ${key + 1} (${JSON.stringify(testCase)})`, () => {
        const { items, regExp } = testCase
        expect(() => filterRegExp(items, regExp)).to.throw(Error)
      })
    })

    it('should filter out non-matching items', () => {
      expect(filterRegExp([], /.+/)).to.eql([])
      expect(filterRegExp(['foo.js', 'foo.txt'], /.*\.js/)).to.eql(['foo.js'])
      expect(filterRegExp(['foo.js', 'foo.txt', 'bar.jsx'], /.*\.js/)).to.eql(['foo.js', 'bar.jsx'])
      expect(filterRegExp(['foo.js', 'foo.txt', 'bar.jsx'], /.*\.js$/)).to.eql(['foo.js'])
    })
  })
})
