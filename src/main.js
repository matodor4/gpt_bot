import { Telegraf } from "telegraf"
import config from "config"
import { message } from "telegraf/filters"
import { code } from "telegraf/format"
import { ogg } from "./ogg.js"
import { openai } from "./openAI.js"

const token = config.get("TELEGRAM_TOKEN")

const bot = new Telegraf(token)

bot.launch()

bot.on(message("text"), async ctx => {
    await ctx.reply("text message")
})
bot.on(message("voice"), async (ctx) => {
    try {
        await ctx.reply(code("Жду ответ от бога"))
        const fileID = ctx.message.voice.file_id
        const link = await ctx.telegram.getFileLink(fileID)
        const userID = String(ctx.message.from.id)

        const oggPath = await ogg.fetch(link.href, userID)
        const mp3Path = await ogg.toMp3(oggPath, userID)

        const text = await openai.transcription(mp3Path)
        const messages = [{role: "user", content: text }]
        const response = await openai.chat(messages)
        await ctx.reply(response.content)

    } catch (e) {
        console.log("error while processing voice message", e.message)
    }


})

bot.command("start", async (ctx) => {
    await ctx.reply("Hello World! ")
})





process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

