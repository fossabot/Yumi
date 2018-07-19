const req = require('unirest')
const { parse } = require('node-html-parser')
const { get: distance } = require('fast-levenshtein')

const AnimeFLV = module.exports = {}

AnimeFLV.search = function (anime) {
  return new Promise((resolve, reject) => { 
    req
     .post('https://animeflv.net/api/animes/search')
     .type('form')
     .header('Accept', 'application/json')
     .send({value: anime.replace(' ','+')})
     .end((res) => {
      const { statusCode, body } = res
      if (statusCode !== 200) {
        console.warn(body)
        return reject(new Error(`hubo un error al hacer la solicitud, statusCode: ${statusCode}`))
      }
      resolve(body)
     })
  })
  .then((items) => {
    if (items.length === 0) return undefined
    const best = {value: undefined, distance: Infinity }
    for (var item of items) {
      var d = distance(item.title, anime)
      if (d < best.distance) { 
        best.value = item
        best.distance = d
      }
    }
    return best.value
  })
  .then((item) => {
    if (!item) return undefined
    return fetchAnime(item)
  })
}

function fetchAnime(anime)
{
  const url = `https://animeflv.net/anime/${anime.id}/${anime.slug}`
  return new Promise((resolve, reject) => {
    req
     .get(url)
     .set('Accept', 'text/html')
     .end((res) => {
      const { statusCode, body } = res
      if (statusCode !== 200) {
        console.warn(body)
        return reject(new Error(`hubo un error al hacer la solicitud, statusCode: ${statusCode}`))
      }
      resolve(body)
     })
  })
  .then((body) => {
    const d = parse(body, { script: true })
    const genres = d
     .querySelector('.Nvgnrs')
     .querySelectorAll('a')
     .map((a) => a.text)

    var alt = d.querySelector('.TxtAlt')
    if (alt) alt = alt.text || undefined
    const title = d.querySelector('.Ficha .Title').text
    const description = d.querySelector('.Description').text
    const state = d.querySelector('.AnmStts').text
    const votes = d.querySelector('#votes_nmbr').text
    const rating = parseFloat(d.querySelector('.vtprmd').text)
    const image = `https://animeflv.net` + d.querySelector('.AnimeCover img').attributes["data-cfsrc"]
    const { anime_info: info, episodes } = grabVars(d.querySelectorAll('script')[17].text)
    return { title, description, state, votes, rating, 
             genres, url, alt, image, info, episodes }
  })
}

function grabVars(js) {
  const vars = {}
  const matches = js.match(/var\s(\w?[\w\d$_]+)\s=([^;\n]*)/g)
  matches.forEach((m) => {
    ma = m.match(/var\s(\w?[\w\d$_]+)\s=([^;\n]*)/)
    vars[ma[1]] = JSON.parse(ma[2])
  })
  return vars  
}