const req = require('unirest')
const { parse } = require('node-html-parser')
const Util = require('./Util.js')

const Drae = module.exports = {}

const url = 'http://dle.rae.es/srv/search'

Drae.search = function search (word) {
  return new Promise((resolve, reject) => {
    req
     .get(url)
     .query({ w: word, m: 3 })
     .end((res) => {
      const { statusCode, body } = res
      if (statusCode !== 200) {
        console.warn(body)
        return reject(new Error(`hubo un error al hacer la solicitud, statusCode: ${statusCode}`))
      }
      var d = parse(body, { script: true })
      const chlg = d.querySelector('body').attributes.onload === 'challenge()'
      if (!chlg) return reject(new Error('no implementado'))
      challenge(d, word).then(resolve)
     })
  })
  .then((d) => {
    d = parse(d)
    const artc = d.querySelector('article')
    if (!artc) return undefined
    const word = {}
    const origin = artc.querySelector('.n2')
    if (origin) word.origin = origin.text
    word.meanings = artc.querySelectorAll('.j').map((m) => m.text)
    return word
  })
}

function challenge (d, word) {
  return new Promise((resolve, reject) => {
    const form = createForm(d)
    req
     .post(url)
     .query({ w: word, m: 3 })
     .type('form')
     .send(form)
     .end((res) => {
      const { statusCode, body } = res
      if (statusCode !== 200) {
        console.warn(body)
        return reject(new Error(`hubo un error al hacer la solicitud, statusCode: ${statusCode}`))
      }
      resolve(body)
     })
  })
}

function createForm(d) {
  const form = {}
  const fields =
    d
     .querySelectorAll('input')
     .map((f) => [ f.attributes.name, f.attributes.value ])
  fields
   .forEach((f) => {
     form[f[0]] = f[1]
   })
  form[fields[1][0]] = Util.resolveDrae(Util.grabVarsDrae(d))
  return form
}
