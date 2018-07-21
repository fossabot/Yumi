const RichEmbed = require('discord.js/src/structures/RichEmbed.js')

const proto = RichEmbed.prototype
const Embed = module.exports = {}

Embed.create = (data) => new RichEmbed(data)

proto.setOkColor = function () {
  return this.setColor(0x82407d)
}

proto.setWarnColor = function () {
  return this.setColor(0xb1234b)
}

proto.safeSetDescription = function (description, url) {
  let string = resolveString(description)
  const more = `...[leer más](${url})`
  if (string.length > 1024) {
    string = url
      ? string.substr(0, 1023 - more.length) + more
      : string.substr(0, 1023) + '...'
  }
  this.description = string
  return this
}

proto.safeAddField = function (name, value, inline, url) {
  let val = resolveString(value)
  const more = `... [leer más](${url})`
  if (val.length > 512) {
    val = url
      ? val.substr(0, 511 - more.length) + more
      : val.substr(0, 511) + '...'
  }
  return this.addField(name, val, inline)
}

function resolveString (data) {
  if (typeof data === 'string') return data
  if (data instanceof Array) return data.join('\n')
  return String(data)
}
