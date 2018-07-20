const { Client: DiscordClient } = require('discord.js')

module.exports = Bot

const proto = Bot.prototype

proto.start = function () {
  const { token, client } = this
  client.on('message', this.handler)
  return client
    .login(token)
}

proto.stop = function () {
  this.client.destroy()
}

function Bot (client = new DiscordClient()) {
  const self = this

  this.client = client
  this.commands = {},
  this.handler = botMessageHandler

  function botMessageHandler(message) {
    const { content, channel } = message
    
    const prefix = self.prefix || 'yu!'
    if (!content.startsWith(prefix)) return
    const args = content.substr(prefix.length).trim().split(' ')
    let cmd = self.commands[args.shift()]
    if (!cmd) return
    try {
      var r = channel.startTyping()
      r = cmd(message, args)
    } catch (err)  {
      botErrorHandler(err)
    }
    if (!r instanceof Promise) return channel.stopTyping()
    return r.catch((err) => {
      botErrorHandler(err)
    })
    .then(() => {
      channel.stopTyping()
    })
  }
}

function botErrorHandler (err) {
  console.error(err)
}
