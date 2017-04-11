'use strict'

const { expect } = require('chai')
const SimpleCache = require('../app/lib/SimpleCache')
const path = require('path')
const fs = require('fs')

const cacheFile = path.join(__dirname, 'testCache.json')
const cache = new SimpleCache(cacheFile)

afterEach('clear cache file', (done) => {
  fs.unlink(cacheFile, (error) => {
    if (error && error.code !== 'ENOENT') {
      done(error)
    } else {
      done()
    }
  })
})

function asyncSet (tag, value, done) {
  cache.set(tag, value, (error) => done(error))
}

function asyncGet (tag, value, done) {
  cache.set(tag, value, (error) => {
    if (error) {
      done(error)
    } else {
      checkGet(tag, value, done)
    }
  })

  function checkGet (tag, expectedValue, done) {
    cache.get(tag, (error, value) => {
      if (error) {
        done(error)
      } else {
        try {
          expect(value).to.eql(expectedValue)
          done()
        } catch (expectError) {
          done(expectError)
        }
      }
    })
  }
}

describe('SimpleCache', () => {
  describe('#set()', () => {
    it('should throw on invalid input', () => {
      expect(() => cache.set()).to.throw(Error)
      expect(() => cache.set(null)).to.throw(Error)
      expect(() => cache.set('')).to.throw(Error)
      expect(() => cache.set('something')).to.throw(Error)
      expect(() => cache.set('something', undefined)).to.throw(Error)
    })

    it('should save "fooValue" to cache', (done) => {
      asyncSet('foo', 'fooValue', done)
    })

    it('should save "null" to cache', (done) => {
      asyncSet('foo', null, done)
    })

    it(`should save "{ foo: 'bar' }" to cache`, (done) => {
      asyncSet('foo', { foo: 'bar' }, done)
    })
  })

  describe('#get()', () => {
    it('should throw on invalid input', () => {
      expect(() => cache.get()).to.throw(Error)
      expect(() => cache.get(null)).to.throw(Error)
      expect(() => cache.get('')).to.throw(Error)
    })

    it('should get "fooValue" from cache', (done) => {
      asyncGet('foo', 'fooValue', done)
    })

    it('should get "null" from cache', (done) => {
      asyncGet('foo', null, done)
    })

    it(`should get "{ foo: 'bar' }" from cache`, (done) => {
      asyncGet('foo', { foo: 'bar' }, done)
    })

    it(`should get "{ foo: 'bar', baz: { bar: null } }" from cache`, (done) => {
      asyncGet('foo', { foo: 'bar', baz: { bar: null } }, done)
    })
  })
})
