'use strict'

const { expect } = require('chai')
const TagCounter = require('../app/lib/TagCounter')
const path = require('path')

const dataDir = path.join(__dirname, 'testCounterData')
const wrongDataDir = path.join(__dirname, 'doesNotExists')
const counter = new TagCounter(dataDir)
const wrongCounter = new TagCounter(wrongDataDir)

function expectErrorCountTags (counter, tags, done) {
  counter.countTags(tags, (error) => {
    if (error) {
      done()
    } else {
      done(error)
    }
  })
}

function expectCountTags (counter, tags, expectedOutput, done) {
  counter.countTags(tags, (error, tagsCount) => {
    if (error) {
      done(error)
    } else {
      try {
        expect(tagsCount).to.eql(expectedOutput)
        done()
      } catch (expectError) {
        done(expectError)
      }
    }
  })
}

describe('TagCounter', () => {
  describe('#countTags()', () => {
    it('should fail on invalid database directory', (done) => {
      expectErrorCountTags(wrongCounter, ['foo'], done)
    })

    const invalidCases = [
      undefined,
      null,
      'foo',
      { foo: 'bar' }
    ]
    invalidCases.forEach((testCase, key) => {
      it(`should fail on invalid input ${key + 1} (${JSON.stringify(testCase)})`, (done) => {
        expectErrorCountTags(counter, testCase, done)
      })
    })

    const validCases = [
      {
        input: ['lectus'],
        output: [ {tag: 'lectus', count: 1} ]
      },
      {
        input: ['ipsum'],
        output: [ {tag: 'ipsum', count: 3} ]
      },
      {
        input: ['lectus', 'consectetur'],
        output: [ {tag: 'consectetur', count: 1}, {tag: 'lectus', count: 1} ]
      },
      {
        input: ['dolor', 'lala', 'ipsum'],
        output: [ {tag: 'ipsum', count: 3}, {tag: 'dolor', count: 2}, {tag: 'lala', count: 0} ]
      },
      {
        input: ['dolor', 'amet', 'yolo'],
        output: [ {tag: 'amet', count: 2}, {tag: 'dolor', count: 2}, {tag: 'yolo', count: 1} ]
      }
    ]
    validCases.forEach((testCase, key) => {
      it(`should count tags correctly ${key + 1} (${JSON.stringify(testCase)})`, (done) => {
        const { input, output } = testCase
        expectCountTags(counter, input, output, done)
      })
    })
  })
})
