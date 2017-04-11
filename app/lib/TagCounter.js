'use strict'

const fs = require('fs')
const path = require('path')
const { countTagsInObject } = require('../utils/tagUtils')

module.exports = class TagCounter {
  constructor (dataDir) {
    this.tags = []
    this.tagsCount = {}
    this.dataDir = dataDir
    this.dataFiles = null
    this.processedFileCount = 0
    this.resultCallback = null
  }

  countTags (tags, resultCallback) {
    this.tags = tags
    this.resultCallback = resultCallback

    if (!Array.isArray(tags)) {
      this.resultCallback(`Error, 'tags' must be an array.`)
    } else {
      this._listDataFiles()
    }
  }

  _listDataFiles () {
    fs.readdir(this.dataDir, (error, dataFiles) => {
      if (error) {
        this.resultCallback(`Failed to read data directory file list. ${error}`)
      } else {
        this._readDataFiles(dataFiles)
      }
    })
  }

  _readDataFiles (dataFiles) {
    this.dataFiles = dataFiles
    this.processedFileCount = 0
    this.tagsCount = {}
    this.dataFiles.forEach((file) => {
      fs.readFile(path.join(this.dataDir, file), 'utf8', (error, content) => {
        if (error) {
          console.error('Failed to read file.', error)
          this._dataFileProcessed()
        } else {
          this._processDataFileContent(file, content)
        }
      })
    })
  }

  _processDataFileContent (file, content) {
    try {
      const data = JSON.parse(content)
      this.tagsCount = countTagsInObject(this.tags, data, this.tagsCount)
    } catch (error) {
      console.error(`Failed to parse file "${file}" into JSON object. ${error}`)
    }

    this._dataFileProcessed()
  }

  _dataFileProcessed () {
    this.processedFileCount++

    if (this.processedFileCount === this.dataFiles.length) {
      const sortedTagsCountList = Object.keys(this.tagsCount)
        .sort()
        .map((key) => {
          return { tag: key, count: this.tagsCount[key] }
        })
        .sort((a, b) => {
          return b.count - a.count
        })
      this.resultCallback(null, sortedTagsCountList)
    }
  }
}
