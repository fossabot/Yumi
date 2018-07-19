const { Client: DiscordClient } = require('discord.js')

module.exports = Bot

const proto = Bot.prototype

proto.start = function () {
  const { token, client } = this
  if (!token) return Promise.reject(new Error('no se ha especificado un token'))
  client.on('message', this.handler)
  return client
    .login(token)
    .catch((O_o) => {
      throw new Error('token inválido')
    })
}

proto.stop = function () {
  this.client.destroy()
}

function Bot (client = new DiscordClient()) {
  this.client = client
  this.commands = {},
  this.handler = botMessageHandler

  const self = this
  function botMessageHandler(message) {
    const { content } = message
    const prefix = self.prefix || 'yu!'
    if (!content.startsWith(prefix)) return
    const args = content.substr(prefix.length).trim().split(' ')
    let cmd = args.shift()
    cmd = self.commands[cmd]
    if (!cmd) return
    var r
    try {
      r = cmd(message, args)
    } catch (err)  {
      botErrorHandler(err)
    }
    if (r instanceof Promise) r.catch(botErrorHandler)
  }
}

function botErrorHandler (err) {
  console.error(err)
}
