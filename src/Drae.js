const req = require('superagent')
const { parse } = require('node-html-parser')
const Util = require('./Util.js')

const Drae = module.exports = {}

const url = 'http://dle.rae.es/srv/search'

Drae.search = function search (word) {
  return req
    .get(url)
    .query({ w: word, m: 3 })
    .then((res) => {
      const { statusCode } = res
      if (!res.ok) throw new Error(`hubo un error al hacer la solicitud, statusCode: ${statusCode}`)
      var d = parse(res.text, { script: true })
      const chlg = d.querySelector('body').attributes.onload === 'challenge()'
      if (!chlg) throw new Error('no implementado')
      return challenge(d, word)
    })
    .then((d) => {
      d = parse(d)
      const artc = d.querySelector('article')
      if (!artc) return
      const word = {}
      const origin = artc.querySelector('.n2')
      if (origin) word.origin = origin.text
      word.meanings = artc.querySelectorAll('.j').map((m) => m.text)
      return word
    })
}

function challenge (d, word) {
  const form = createForm(d)
  return req
    .post(url)
    .query({ w: word, m: 3 })
    .type('form')
    .send(form)
    .then((res) => {
      const { statusCode } = res
      if (!res.ok) throw new Error(`hubo un error al hacer la solicitud, statusCode: ${statusCode}`)
      return res.text
    })
}

function createForm (d) {
  const form = {}
  const fields = d.querySelectorAll('input').map((f) => [ f.attributes.name, f.attributes.value ])
  fields.forEach((f) => { form[f[0]] = f[1] })
  form[fields[1][0]] = Util.resolveDrae(Util.grabVarsDrae(d))
  return form
}
