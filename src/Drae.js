const http = require('http')
const { escape: encodeURIComponent } = require('querystring')
const { parse } = require('node-html-parser')

const Drae = module.exports = {}

Drae.search = function search (word) {

  return new Promise((resolve, reject) => {
    const req = http.request({ 
      hostname: 'dle.rae.es',
      path: `/srv/search?w=${word}&m=30`
    })

    req.on('response', responseHandler)
    req.end()

    function responseHandler (res) {
      const { statusCode } = res
      const rawData = []

      if (statusCode !== 200) { 
        reject(new Error(`la solicitud no fue exitosa, StatusCode: ${statusCode}`)) 
        return
      }

      res.on('data', (data) => { rawData.push(data) })
      res.on('end', handleData)
      res.setEncoding('utf8')

      function handleData () {
        const doc = parse(rawData.join(''), { script: true })
        const { onload } = doc.querySelector('body').attributes
        if (onload === 'challenge()') { 
          resolve(challenge(doc)) 
          return
        }
        resolve(doc.text)
      }
    }
  })

  function challenge (doc) {
    return new Promise((resolve, reject) => {
      let fields = doc
       .querySelectorAll('input')
      fields[1].attributes.value = '64be7e30362b23b7a4d6ed2d52ac97b5:lhkl:wPq20Sbf:186833147';
      fields = fields.map((i) => { const { name, value } = i.attributes ; return `${name}=${encodeURIComponent(value)}` })
      fields = fields.join('&')
      
      const req = http.request({
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(fields)
        },
        hostname: 'dle.rae.es',
        path: `/srv/search?w=${word}&=m30`
      })

      req.on('response', responseHandler)
      req.end(fields)

      function responseHandler(res) {
        const { statusCode } = res
        const rawData = []

        if (statusCode !== 200) {
          reject(new Error('error al postear la data'))
          return
        }

        res.on('data', (data) => { rawData.push(data) })
        res.on('end', handleData)
        res.setEncoding('utf8')

        function handleData() {
          const word = {}
          const artc = parse(rawData.join('')).querySelector('article')

          word.url = `http://dle.rae.es/?id=` + artc.attributes.id
          word.origin = artc.querySelector('.n2').text
          word.meanings = artc.querySelectorAll('.j').map((m) => m.text)

          resolve(word)
        }
      }      
    })
  }
}
