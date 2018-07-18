const { Client: DiscordClient } = require('discord.js')

module.exports = Bot

const proto = Bot.prototype

proto.start = function BotStart() {
  const { token, client } = this
  if (!token) return Promise.reject(new Error('no se ha especificado un token'))
  client.on('message', this.handler)
  return client
    .login(token)
    .catch((O_o) => {
      throw new Error('token inválido')
    })
}

proto.stop = function BotStop() {
  this.client.destroy()
}

function Bot (client = new DiscordClient()) {
  this.client = client
  this.commands = {},
  this.handler = BotMessageHandler

  const self = this
  function BotMessageHandler(message) {
    const { content } = message
    const prefix = self.prefix || 'yu!'
    if (!content.startsWith(prefix)) return
    const args = content.substr(prefix.length).trim().split(' ')
    let cmd = args.shift()
    cmd = self.commands[cmd]
    if (cmd) cmd(message, args)
  }
}