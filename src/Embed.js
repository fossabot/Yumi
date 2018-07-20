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

proto.safeSetDescription = function (description) {
  let string = resolveString(description)
  if (string.length > 2048 ) string = string.substr(0, 2044) + '...'
  this.description = string
  return this
}

proto.safeAddField = function (name, value, inline) {
  var val = resolveString(value)
  if (val.length > 512) val = value.substr(0, 508) + '...'
  return this.addField(name, val, inline)
}

function resolveString(data) {
  if (typeof data === 'string') return data;
  if (data instanceof Array) return data.join('\n');
  return String(data);
}
