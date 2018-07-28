const fs = require('fs')
const path = require('path')
const Bot = require('../src/Bot.js')

try {
  var config = loadConfig()
} catch (err) {
  console.error(err.message)
  if (err.original) console.error('\n', err.original)
  process.exit(-1)
}

const bot = new Bot()
bot.token = config.token
bot.commands = require('../src/commands.js')

const { client } = bot

client.on('ready', () => {
  console.log('bot corriendo \\^^/')
})

bot.start()
  .catch((err) => {
    console.error(err)
    bot.stop()
  })

function loadConfig () {
  const cfg = path.join(process.cwd(), 'yumi.config.js')
  if (!fs.existsSync(cfg)) throw new Error('yumi.config.js no existe, para generar uno nuevo tomar como base example-yumi.config.js')

  try {
    var config = require(cfg)
  } catch (err) {
    const cfgErr = new Error('yumi.config.js contiene errores')
    cfgErr.original = err
    throw cfgErr
  }

  return config
}
