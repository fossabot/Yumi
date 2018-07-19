const fs = require('fs')
const assert = require('assert')
const { resolve } = require('path')
const Util = require('../src/Util.js')

const chlg = fs.readFileSync(resolve(__dirname, './Drae.challenge.html'), 'utf8')
const chlgR = 'b011a7ea85a3aa2f92106c3dc2663455:zywy:28l8oQ13:697144227'

assert.strictEqual(Util.resolveDrae(Util.grabVarsDrae(chlg)), chlgR)
