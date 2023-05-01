import { Telegraf } from "telegraf"
import {Converter} from "./infra/converter.js";
import {Application} from "./app.js";
import {FileDownloader} from "./infra/fileDownloader.js";
import {OpenAI} from "./infra/openAI.js";
import {message} from "telegraf/filters";
import {Config} from "./config.js";


const openAIKey = process.env.OPENAI_KEY!
const telegramToken = process.env.TELEGRAM_TOKEN!
const config = new Config(openAIKey, telegramToken)
const err =  config.validate()
if (err != null) {
    console.log("get config error")
}
// создаем инстанс приложения
const converter = new Converter()
const downloader = new FileDownloader()
const openAI = new OpenAI(config.openAIKey)

const app = new Application(downloader, converter, openAI)
const bot = new Telegraf(config.telegramToken)

console.log("start")
const resp = bot.launch()
resp.catch(async (e) => {
    console.log(e.message)
})

bot.on(message("text"), async ctx => {
    await ctx.reply("text message")
})

bot.on("voice", async (ctx) => {
    console.log("start processing voice message")
    const fileID = ctx.message.voice.file_id
    console.log("fileID", fileID)
    const link = await ctx.telegram.getFileLink(fileID)
    console.log("link", link.href)
    const userID = String(ctx.message.from.id)
    console.log("userID", userID)
    const response = await app.Voice(link.href, userID)
    console.log("response ", response.content)
    ctx.reply(response.content)
})
// Обработка событий
// Голосовое сообщение
// app.voice()





