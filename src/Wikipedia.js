const req = require('superagent')
const { get: distance } = require('fast-levenshtein')
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
      const best = { value: undefined, distance: Infinity }
      const items = results[1]
      if (items.length === 0) return undefined
      for (let i = 0; i < items.length; i++) {
        const d = distance(query, items[i])
        if (d < best.distance) {
          best.value = { title: items[i], description: results[2][i], url: results[3][i] }
          best.distance = d
        }
      }
      return best.value
    })
}
