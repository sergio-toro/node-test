'use strict'

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

module.exports = class SimpleCache {
  constructor (cacheFile = null) {
    this.cache = null
    this.cacheFile = cacheFile || path.join(__dirname, 'defaultCache.json')
    this.cacheFileEncoding = 'utf-8'
  }

  get (key, callback) {
    if (typeof key !== 'string' || key.trim().length === 0) {
      throw new Error(`Error, 'key' parameter must be an string and cannot be empty.`)
    }
    if (this.cache === null) {
      this._initSimpleCache((error) => {
        if (error) {
          callback(error)
        } else {
          this.get(key, callback)
        }
      })
    } else {
      callback(null, this.cache[this._getKeyAsHash(key)])
    }
  }

  set (key, value, callback) {
    if (typeof key !== 'string' || key.trim().length === 0) {
      throw new Error(`Error, 'key' parameter must be an string and cannot be empty.`)
    }
    if (value === undefined) {
      throw new Error(`Error, 'value' cannot be undefined`)
    }
    if (this.cache === null) {
      this._initSimpleCache((error) => {
        if (error) {
          callback(error)
        } else {
          this.set(key, value, callback)
        }
      })
    } else {
      this.cache[this._getKeyAsHash(key)] = value
      this._writeCache(callback)
    }
  }

  _getKeyAsHash (key) {
    const shasum = crypto.createHash('sha1')
    shasum.update(key)
    return shasum.digest('hex')
  }

  _initSimpleCache (callback) {
    fs.readFile(this.cacheFile, this.cacheFileEncoding, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          this.cache = {}
          this._writeCache(callback)
        } else {
          callback(error)
        }
      } else {
        try {
          this.cache = JSON.parse(content)
        } catch (parseError) {
          console.error('Cache file is corrupted, creating a new cache database.')
          this.cache = {}
        }
        this._writeCache(callback)
      }
    })
  }

  _writeCache (callback) {
    const cacheString = JSON.stringify(this.cache)
    fs.writeFile(this.cacheFile, cacheString, this.cacheFileEncoding, callback)
  }
}
