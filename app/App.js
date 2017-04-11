'use strict'

const path = require('path')
const fs = require('fs')

const { uniqueList, stringListToArray } = require('./utils/arrayUtils')
const TagCounter = require('./lib/TagCounter')
const SimpleCache = require('./lib/SimpleCache')

const ENABLE_CACHE = true

module.exports = class App {
  constructor (dataDir, cacheDir, defaultInputFile) {
    this.defaultInputFile = defaultInputFile
    this.userInput = process.argv[2]

    this.cache = new SimpleCache(path.join(cacheDir, 'tagsCache.json'))
  }

  run () {
    if (this.userInput) {
      const tags = uniqueList(stringListToArray(this.userInput))
      this._getTagCount(tags)
    } else {
      this._readTagsFromFile()
    }
  }

  _readTagsFromFile () {
    fs.readFile(this.defaultInputFile, 'utf8', (error, fileContent) => {
      if (error) {
        console.error('Failed to read tags from input file.', error)
      } else {
        const tags = uniqueList(stringListToArray(fileContent))
        this._getTagCount(tags)
      }
    })
  }

  _getTagCount (tags) {
    if (ENABLE_CACHE) {
      this._getTagCountFromCache(tags)
    } else {
      this._getTagCountFromData(tags)
    }
  }

  _getTagCountFromData (tags) {
    const counter = new TagCounter(this.dataDir)
    counter.countTags(tags, (error, tagsCount) => {
      if (error) {
        console.error('Failed to get tag count from data files.', error)
      } else {
        this._saveTagCountToCache(tags, tagsCount)
      }
    })
  }

  _getTagCountFromCache (tags) {
    this.cache.get(this._getCacheKey(tags), (error, tagsCount) => {
      if (error || !tagsCount) {
        this._getTagCountFromData(tags)
      } else {
        this._displayTagCount(tagsCount)
      }
    })
  }

  _saveTagCountToCache (tags, tagsCount) {
    this.cache.set(this._getCacheKey(tags), tagsCount, (error) => {
      if (error) {
        console.log('Failed to store tagCount to cache', error)
      } else {
        this._displayTagCount(tagsCount)
      }
    })
  }

  _displayTagCount (tagsCount) {
    console.log('Seen tags count:')
    tagsCount.forEach((row) => {
      console.log(`${row.tag}\t${row.count}`)
    })
  }

  _getCacheKey (tags) {
    return tags.sort().join(',')
  }
}
