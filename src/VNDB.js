const { Socket } = require('net')

var Types = {
  ERROR: 'error',
  RESULTS: 'results'
}

class VNDBSocket extends Socket 
{
  constructor()
  {
    super()
    this.setEncoding('utf8')
  }

  connect () {
    const { socket } = this
    return new Promise((resolve, reject) => {
      super.connect({ host: 'api.vndb.org', port: 19534 }, resolve)
    })
  }

  end () {
    super.end()
    return Promise.resolve()
  }

  send (data) {
    return new Promise((resolve, reject) => {
      const self = this
      const rawData = []

      this.write(data + '\x04')
      this.on('data', dataHandler)
      this.once('error', errorHandler)

      function dataHandler (data) {
        rawData.push(data)
        if (data[data.length - 1] !== '\x04') return
        const res = rawData.join('')
        resolve(res.substr(0, res.length - 1))
        self.removeListener('data', dataHandler)
        self.removeListener('error', errorHandler)       
      }

      function errorHandler (err) {
        reject(err)
      }
    })
    .then((res) => {
      const i = res.indexOf(' ')
      if (i < 0) return
      const resType = res.substr(0, i)
      const resContent = JSON.parse(res.substr(i))
      return resType === 'error' ? new Error(resContent.msg) : resContent
    })
  }

  login (opts)
  {
    if (!opts || !opts.client || !opts.clientver) throw new TypeError('se debe especificar client y clientVer')
    opts.protocol = opts.protocol || '1'
    return this.send(`login ${JSON.stringify(opts)}`)
  }
}

module.exports = VNDBSocket
