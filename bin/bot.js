const Bot = require('../src/Bot.js')

const bot = new Bot()
const { client } = bot

client.on('ready', () => {
  console.log('bot corriendo \\^^/')
})

bot.token = process.env.YUMI_TOKEN
bot
  .start()
  .catch((err) => {
    console.error(err)
    bot.stop()
  })
