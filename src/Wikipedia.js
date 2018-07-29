const req = require('superagent')
const { get: distance } = require('fast-levenshtein')
const { parse } = require('node-html-parser')
const Wiki = module.exports = {}

Wiki.search = function (query) {
  return req.get('https://es.wikipedia.org/w/api.php')
    .accept('application/json')
    .query({
      action: 'opensearch',
      format: 'json',
      formatVersion: 2,
      search: query,
      limit: 25
    })
    .then((res) => {
      const {statusCode} = res
      if (!res.ok) throw new Error(`hubo un error al hacer la solicitud, statusCode: ${statusCode}`)
      return res.body
    })
    .then((results) => {
      if (!results) return undefined
      const best = { value: undefined, distance: Infinity }
      const items = results[1] || []
      for (let i = 0; i < items.length; i++) {
        const d = distance(query, items[i])
        if (d < best.distance) {
          best.value = { title: items[i], description: results[2][i], url: results[3][i] }
          best.distance = d
        }
      }
      return best.value
    })
    .then((doc) => {
      if (!doc) return undefined
      return fetchDoc(doc)
    })
}

function fetchDoc (doc) {
  return req.get(doc.url)
    .then((res) => {
      const { statusCode } = res
      if (!res.ok) throw new Error(`hubo un error al hacer la solicitud, statusCode: ${statusCode}`)
      const d = parse(res.text)
      const thumb = d.querySelector('.mw-parser-output .thumb img')
      doc.description = d.querySelector('.mw-parser-output').childNodes
        .filter((c) => c.tagName === 'p' && c.text.trim().length > 0)[0]
        .text
      doc.disambig = d.querySelector('.mw-disambig-page') !== null
      if (doc.disambig) {
        const related = d.querySelectorAll('.mw-parser-output li b a')
          .map((a) => {
            let surl = a.attributes.href
              .replace('(', '%28')
              .replace(')', '%29')
            return {
              title: a.attributes.title,
              url: `https://es.wikipedia.org${surl}`
            }
          })
        doc.related = related
      }
      if (thumb) {
        doc.thumbnail = `https:${thumb.attributes.src}`
      }
      return doc
    })
}
