'use strict'

/**
 * Counts how many times a tag is seen in a recursive object
 * @param  {Array} tagsToCount  List of tags to count
 * @param  {Object} data        Nested objects to search
 * @param  {Object} count       Initial count, Object {tag: count}
 * @return {Object}             Tag count. Object {tag: count}
 */
module.exports.countTagsInObject = function countTagsInObject (tagsToCount, data, count = {}) {
  if (!Array.isArray(tagsToCount)) {
    throw new Error(`Error, 'tagsToCount' must be an array.`)
  }

  if (data !== Object(data) || Array.isArray(data)) {
    throw new Error(`Error, 'data' must be an object or a nested object with children.`)
  }

  const { tags, children } = data

  if (!count || Object.keys(count).length === 0) {
    tagsToCount.forEach((tag) => { count[tag] = 0 })
  }

  if (tags && tags.length > 0) {
    tagsToCount.forEach((tag) => {
      if (typeof count[tag] === 'undefined') {
        count[tag] = 0
      }
      if (tags.indexOf(tag) !== -1) {
        count[tag]++
      }
    })
  }

  if (children && children.length > 0) {
    children.forEach((childData) => {
      count = countTagsInObject(tagsToCount, childData, count)
    })
  }

  return count
}
