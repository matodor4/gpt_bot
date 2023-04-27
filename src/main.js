import { Telegraf } from "telegraf"
import config from "config"
import { message } from "telegraf/filters"
import { ogg } from "./ogg.js"

const token = config.get("TELEGRAM_TOKEN")

const bot = new Telegraf(token)

bot.launch()

bot.on(message("text"), async ctx => {
    await ctx.reply("text message")
})
bot.on(message("voice"), async (ctx) => {
    try {
        const fileID = ctx.message.voice.file_id
        const link = await ctx.telegram.getFileLink(fileID)
        const userID = String(ctx.message.from.id)

        const oggPath = await ogg.fetch(link.href, userID)
        const mp3Path = await ogg.toMp3(oggPath, userID)


        await ctx.reply(JSON.stringify(String(oggPath), null, 2))
    } catch (e) {
        console.log("error while processing voice message", e.message)
    }


})

bot.command("start", async (ctx) => {
    await ctx.reply("Hello World! ")
})





process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

