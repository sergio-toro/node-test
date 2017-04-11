'use strict'

/**
 * Returns a unique list of non-empty strings
 * @param  {array} list Array of strings
 * @return {array}      Array of unique non-empty strings
 */
module.exports.uniqueList = function uniqueList (list) {
  if (!Array.isArray(list)) {
    throw new Error(`Error, uniqueList expects an array as input. ${list}`)
  }

  let seenItems = {}

  return list.map(item => item.trim())
    .filter(item => {
      if (!item.length || seenItems[item]) {
        return false
      }
      seenItems[item] = true
      return true
    })
}

/**
 * Converts a comma (,) or new line (\\n) separated list of items to array
 * @param  {string} string comma (,) or new line (\\n) separated list of items
 * @return {array}         array of strings
 */
module.exports.stringListToArray = function stringListToArray (string) {
  if (!string.length) {
    return []
  }

  let list
  if (string.indexOf(',') !== -1) {
    list = string.split(',')
  } else if (string.indexOf('\n') !== -1) {
    list = string.split('\n')
  } else {
    list = [ string ]
  }

  return list.map(item => item.trim())
}

/**
 * Filters an array of strings applying a RegExp
 * @param  {array}  list   Array to filter
 * @param  {RegExp} regExp RegExp to apply to each item
 * @return {array}         Filtered array
 */
module.exports.filterRegExp = function filterRegExp (list, regExp) {
  if (!Array.isArray(list)) {
    throw new Error(`Error, uniqueList expects an array as input. ${list}`)
  }
  if (!(regExp instanceof RegExp)) {
    throw new Error(`Error, regExp parameter must be an instance of RegExp. Passed ${regExp}.`)
  }
  return list.filter(listItem => regExp.test(listItem))
}
