const Drae = require('./Drae.js')
const RichEmbed = require('discord.js/src/structures/RichEmbed.js')

const cmds = module.exports = {}

cmds.say = function (msg, args) {
  const text = args.join(' ')
  try {
    return msg.channel.send(new RichEmbed(JSON.parse(text)))
  } catch(err) {
    return msg.channel.send(text)
  }
}

cmds.drae = function (msg, args) {
  const word = args[0]
  return Drae
    .search(word)
    .then((data) => {
      if (!data) return msg.channel.send('Ninguna coincidencia para: ' + word)
      const embed = new RichEmbed({
        "title": `Definición de: ${word}`,
        "author": {
          "name": "Diccionario de la Lengua Española",
          "url": "https://dle.rae.es/"
        },
        "description": data.meanings.join('\n'),
        "footer": {
          "text": 'Proporcionado por http://rae.es/'
        },
        "thumbnail": {
          "url": "http://dle.rae.es/images/logos/151x184xdle151x184.jpg.pagespeed.ic.hy18q1eIBQ.jpg"
        }
      })
      if (data.url) embed.url = data.url
      return msg.channel.send(embed)
    })
}
