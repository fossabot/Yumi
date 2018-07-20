const Drae = require('./Drae.js')
const AnimeFLV = require('./AnimeFLV.js')
const VNDBSocket = require('./VNDB.js')
const { get: distance } = require('fast-levenshtein')
const Embed = require('./Embed.js')
const { FLAGS: Permission } = require('discord.js/src/util/Permissions.js')
const req = require('superagent')

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
      if (!data) return Promise.resolve()
      const embed = Embed
        .create()
        .setOkColor()
        .setTitle(`Definición de: ${word}`)
        .setAuthor(
          'Diccionario de la lengua Española', 
          'http://dle.rae.es/images/logos/151x184xdle151x184.jpg.pagespeed.ic.hy18q1eIBQ.jpg', 
          'https://dle.rae.es'
        )
        .safeSetDescription(data.meanings)
      if (data.url) embed.setUrl(data.url)
      return msg.channel.send(embed)
    })
}

cmds.anime = function (msg, args) {
  const txt = args.join(' ')
  if (txt.length === 0) return
  return AnimeFLV
   .search(txt)
   .then((anime) => {
      if(!anime) return Promise.resolve()
      const s = parseInt(anime.rating)
      let stars = ''
      for(let i = 0; i < s; i++) {
        stars += '⭐'
      }
      let state = `**${anime.state.toUpperCase()}**\n${anime.episodes.length} *caps.*`
      let rating = `${stars}\n**${anime.rating}** - ${anime.votes} votos`
      if (anime.info[3]) rating += `\n*prox. cap.* ${anime.info[3]}`

      const embed = Embed
        .create()
        .setOkColor()
        .setAuthor('AnimeFLV', undefined , 'https://animeflv.net')
        .setTitle(anime.title)
        .setImage(anime.image)
        .addField('Sinopsis', anime.description)
        .addField('Géneros', anime.genres || '*sin especificar', true)
        .addField('Ranking', rating, true)
        .addField('Estado', state, true)
        .setURL(anime.url)
      if (anime.alt) embed.setDescription(anime.alt)
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
      if (!vn) return Promise.resolve()
      let { description } = vn
      const aliases =  vn.aliases || '*sin especificar*'
      const embed = Embed.create()
        .setOkColor()
        .setTitle(vn.title)
        .safeSetDescription(vn.description)
        .safeAddField('Títulos alternativos', aliases)
      if (isNsfw(msg.channel) || !vn.image_nsfw) embed.setImage(vn.image)
      return msg.channel.send(embed)  
    })
    .then(() => {
      socket.end()
    })
}

cmds.help = function (msg, args){
  const { bot } = msg
  const { username: botName } = msg.client.user
  const commands = Object.keys(cmds).map((cmd) => bot.prefix + cmd)
  const embed = Embed
   .create()
   .setOkColor()
   .setTitle('Comandos Disponibles')
   .safeSetDescription(commands)
  return msg.channel.send(embed)
}

cmds.kick = function (msg, args) {
  if (msg.channel.type !== 'text') return Promise.resolve()
  return msg.guild
    .fetchMember(msg.author)
    .then((user) => {
      if (!user.hasPermission(Permission.KICK_MEMBERS)) return msg.channel.send('No tienes el permiso KICK_MEMBERS')
      const mentions = msg.mentions.members.array()
      const all = []
      for (var guildUser of mentions) {
        const kick = guildUser.kick()
         .catch((err) => {
             throw new KickError(guildUser.user, err)
         })
         all.push(kick)
      }
      return Promise
      .all(all)
      .catch((err) => {
        return msg.channel.send(`Error al kickear ${err.user.username}: ${err.message}`)      
      })       
    })
}

cmds["8ball"] = function (msg, args) {
  const q = args.join(' ')
  if (q.indexOf('?') < 0) return msg.channel.send('no parece una pregunta')
  return req
    .get('https://yesno.wtf/api')
    .set('Accept', 'application/json')
    .then((res) => {
      var {body: res} = res
      const embed = Embed
        .create()
        .setOkColor()
        .addField('Pregunta', q, true)
        .addField('Respuesta', yesno[res.answer], true)
        .setImage(res.image)
      return msg.channel.send(embed)
    })
}

function isNsfw(channel) {
  return channel.nsfw || channel.type === 'dm'
}

class KickError extends Error {
  constructor(user, error)
  {
    super(error.message)
    this.user = user
  }
}

var yesno = {
  "yes": "sí",
  "no": "no",
  "maybe": "tal vez"
}
