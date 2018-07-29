const { Client: DiscordClient } = require('discord.js')

module.exports = Bot

const proto = Bot.prototype

proto.start = function () {
  return this.client.login(this.token)
}

proto.stop = function () {
  this.client.destroy()
  return Promise.resolve()
}

function Bot (opts = {}) {
  this.client = opts.client || new DiscordClient()
  this.prefix = opts.prefix || 'yu!'
  this.token = opts.token
  this.commands = {}

  var messageHandler = (msg) => {
    if (!msg.content.startsWith(this.prefix)) return
    const args = msg.content.substr(this.prefix.length).trim().split(/ +/)
    const cmd = this.commands[args.shift()]
    if (!cmd) return
    msg.channel.startTyping()
    try {
      msg.bot = this
      var r = cmd(msg, args)
    } catch (err) {
      errorHandler(err)
    }
    if (!(r instanceof Promise)) return msg.channel.stopTyping()
    return r.catch(errorHandler)
      .then(() => msg.channel.stopTyping())
  }

  this.client.on('message', messageHandler)

  function errorHandler (err) {
    console.error(err)
  }
}
