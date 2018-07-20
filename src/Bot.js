const { Client: DiscordClient } = require('discord.js')

module.exports = Bot

const proto = Bot.prototype

proto.start = function () {
  const { token, client, handler, prefix } = this
  this.prefix = prefix || 'yu!'
  client.on('message', handler)
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

  function botMessageHandler(msg) {
    msg.bot = self
    const { prefix } = self
    const { content: text, channel: chnl } = msg
    if (!text.startsWith(prefix)) return
    const args = text.substr(prefix.length).trim().split(' ')
    let cmd = self.commands[args.shift()]
    if (!cmd) return
    chnl.startTyping()
    try {
      var r = cmd(msg, args)
    } catch (err)  {
      botErrorHandler(err)
    }
    if (r instanceof Promise) return r.catch(botErrorHandler).then(() => chnl.stopTyping())
    chnl.stopTyping()
  }
}

function botErrorHandler (err) {
  console.error(err)
}
