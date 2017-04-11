'use strict'

const path = require('path')
const App = require('./app/App')

const DATA_DIR = path.join(__dirname, 'data')
const CACHE_DIR = path.join(__dirname, 'cache')
const INPUT_FILE = path.join(__dirname, '/tags.txt')

const app = new App(DATA_DIR, CACHE_DIR, INPUT_FILE)

app.run()
