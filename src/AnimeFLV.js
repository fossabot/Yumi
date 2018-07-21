const req = require('superagent')
const { parse } = require('node-html-parser')
const { get: distance } = require('fast-levenshtein')

const AnimeFLV = module.exports = {}

AnimeFLV.search = function (anime) {
  return req
    .post('https://animeflv.net/api/animes/search')
    .type('form')
    .set('Accept', 'application/json')
    .send({ value: anime.replace(' ', '+') })
    .then((res) => {
      const { statusCode } = res
      if (!res.ok) throw new Error(`hubo un error al hacer la solicitud, statusCode: ${statusCode}`)
      const { body: items } = res
      if (items.length === 0) return
      const best = { value: undefined, distance: Infinity }
      for (var item of items) {
        var d = distance(item.title, anime)
        if (d < best.distance) {
          best.value = item
          best.distance = d
        }
      }
      return fetchAnime(best.value)
    })
}

function fetchAnime (anime) {
  const url = `https://animeflv.net/anime/${anime.id}/${anime.slug}`
  return req
    .get(url)
    .then((res) => {
      const {statusCode} = res
      if (!res.ok) throw new Error(`hubo un error al hacer la solicitud, statusCode: ${statusCode}`)
      const d = parse(res.text, { script: true })
      const genres = d.querySelectorAll('.Nvgnrs a').map((a) => a.text)
      var alt = d.querySelector('.TxtAlt')
      if (alt) alt = alt.text || undefined
      const title = d.querySelector('.Ficha .Title').text
      const description = d.querySelector('.Description').text
      const state = d.querySelector('.AnmStts').text
      const votes = d.querySelector('#votes_nmbr').text
      const rating = parseFloat(d.querySelector('.vtprmd').text)
      const image = `https://animeflv.net` + d.querySelector('.AnimeCover img').attributes.src
      const script = d.querySelectorAll('script').filter((s) => s.text.indexOf('var episodes =') > 0)[0].text
      const { anime_info: info, episodes } = grabVars(script)
      return { title, description, state, votes, rating, genres, url, alt, image, info, episodes }
    })
}

function grabVars (js) {
  const vars = {}
  const matches = js.match(/var\s(\w?[\w\d$_]+)\s=([^;\n]*)/g)
  matches.forEach((m) => {
    const ma = m.match(/var\s(\w?[\w\d$_]+)\s=([^;\n]*)/)
    vars[ma[1]] = JSON.parse(ma[2])
  })
  return vars
}
