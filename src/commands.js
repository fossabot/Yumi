const Drae = require('./Drae.js')
const RichEmbed = require('discord.js/src/structures/RichEmbed.js')

const cmds = module.exports = {}

cmds.say = function (msg, args) {
  const text = args.join(' ')
  msg.channel.send(text)
}

cmds.drae = function (msg, args) {
  if (args.length > 1) return
  const word = args.join('')
  Drae
    .search(word)
    .then((data) => {
      msg.channel.send(new RichEmbed({
        "title": `Definición de: ${word}`,
        "url": data.url,
        "author": {
          "name": "Diccionario de la lengua Española",
          "url": "https://dle.rae.es/"
        },
        "description": data.meanings.join('\n'),
        "footer": {
          "text": "Mostrando 1 de 1"
        },
        "thumbnail": {
          "url": "http://dle.rae.es/images/logos/151x184xdle151x184.jpg.pagespeed.ic.hy18q1eIBQ.jpg"
        }
      }))
    })
}
