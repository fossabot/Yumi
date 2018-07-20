const Drae = require('./Drae.js')
const AnimeFLV = require('./AnimeFLV.js')
const VNDBSocket = require('./VNDB.js')
const { get: distance } = require('fast-levenshtein')
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
          "text": 'Proporcionado por http://rae.es/',
          "icon_url": "http://dle.rae.es/images/logos/151x184xdle151x184.jpg.pagespeed.ic.hy18q1eIBQ.jpg"
        },
      })
      if (data.url) embed.url = data.url
      return msg.channel.send(embed)
    })
}

cmds.anime = function (msg, args) {
  const txt = args.join(' ')
  if (txt.length === 0) return
  return AnimeFLV
   .search(txt)
   .then((anime) => {
      if(!anime) return msg.channel.send(`Sin resultados para: ${txt}`)
      const s = parseInt(anime.rating)
      let stars = ''
      for(let i = 0; i < s; i++) {
        stars += '⭐'
      }
      const embed = new RichEmbed({
        'author': {
          'name': 'AnimeFLV',
          'url': 'https://animeflv.net'
        },
        'title': anime.title,
        'image': { 'url' : anime.image },
        'fields': [{
          'name': 'Sinopsis',
          'value': anime.description
        },{
          'name': 'Géneros',
          'value': anime.genres.join('\n') || '*sin especificar*',
          'inline': true
        }, {
          'name': 'Ranking',
          'value': `${stars}\n**${anime.rating}** - ${anime.votes} votos`,
          'inline': true
        }, {
          'name': 'Estado',
          'value': `**${anime.state.toUpperCase()}**\n${anime.episodes.length} *caps.*`,
          'inline': true
        }],
        'url': anime.url,
        'footer' : {
          'text': 'Proporcionado por https://animeflv.net',
          'icon_url': 'https://i.imgur.com/SVukEKB.png'
        }
      })
      if (anime.alt) embed.description = anime.alt
      if (anime.info[3]) embed.fields[3].value += `\n*prox. cap.* ${anime.info[3]}`
      return msg.channel.send(embed)
   })
}

cmds.vndb = function (msg, args) 
{
  const vn = args.join(' ').replace('"', '\\"')
  if (vn.length === 0) return
  const socket = new VNDBSocket()
  return socket
    .connect()
    .then(() => {
      return socket.login({client: 'Yuki', clientver: '0.1.0-dev'})
    })
    .then(() => {
      return socket.send(`get vn basic (title ~ "${vn}")`)
    })
    .then((data) => {
      const best = { value: undefined, distance: Infinity }
      for (item of data.items) {
        const d = distance(item.title, vn)
        if (d < best.distance) {
          best.value = item
          best.distance = d
        }  
      }
      return best.value
    })
    .then((vn) => {
      if (!vn) return undefined
      return socket.send(`get vn basic,details,stats (id = "${vn.id}")`).then((vn) => {
        return vn.items[0]
      })
    })
    .then((vn) => {
      if (!vn) return msg.channel.send('novela no encontrada')
      let { description } = vn
      if (description.length > 512) description = description.substr(0, 511 - 3) + '...'
      const embed = new RichEmbed({
        'title': vn.title,
        'fields': [{
          'name': 'Sinopsis',
          'value': description
        }]
      })
      if (vn.aliases) vn.description = vn.aliases
      if (isNsfw(msg.channel) || !vn.image_nsfw) embed.image = { url: vn.image }
      return msg.channel.send(embed)  
    })
    .then(closeSocket)
    .catch(closeSocket)

    function closeSocket (err) {
      if (err instanceof Error) console.warn(err)
      return socket.end()
    }
}

cmds.help = function (msg, args){
  const { bot } = msg
  const { username: botName } = msg.client.user
  const commands = Object.keys(cmds).map((cmd) => bot.prefix + cmd).join('\n')
  const embed = new RichEmbed({
    'title': botName,
    'description': `Comandos disponibles:\n${commands}`
  })
  return msg.channel.send(embed)
}

function isNsfw(channel) {
  return channel.nsfw || channel.type === 'dm'
}
