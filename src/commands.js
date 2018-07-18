const cmds = module.exports = {}

cmds.say = function Say(msg, args) {
  const text = args.join(' ')
  msg.channel.send(text)
}
