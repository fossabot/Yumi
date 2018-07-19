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
      const d = parse(body, { script: true })
      const chlg = d.querySelector('body').attributes.onload === 'challenge()'
      if (!chlg) return resolve(d)
      return resolve(challenge(d, word))
    })
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
      const word = {}
      const artc = parse(body).querySelector('article')
      word.url = `http://dle.rae.es/?id=` + artc.attributes.id
      word.origin = artc.querySelector('.n2').text
      word.meanings = artc.querySelectorAll('.j').map((m) => m.text)
      resolve(word)
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
