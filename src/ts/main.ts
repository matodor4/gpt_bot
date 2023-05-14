import { Telegraf, session, Context } from "telegraf"
import { Converter } from "./infra/converter.js";
import { Application } from "./app.js";
import { FileDownloader } from "./infra/fileDownloader.js";
import { OpenAI } from "./infra/openAI.js";
import { message } from "telegraf/filters";
import { Config } from "./config.js";
import { UserRepository } from "./repository/user_repositoty.js";
import { MessageRepository } from "./repository/message_reposiroty.js";
import { ChatRepository } from "./repository/chat_repository.js";
import { PrismaClient } from "@prisma/client";



export class TelegramRequst {
    readonly userID: number
    readonly userName: string
    readonly isBot: boolean
    readonly languageCode: string
    readonly chatID: number
    protected text?: string
    protected voiceLink?:string

    constructor(userID: number, userName: string, isBot: boolean, languageCode: string, chatID: number) {
        this.userID = userID
        this.userName = userName
        this.isBot = isBot
        this.languageCode = languageCode
        this.chatID = chatID
    }

    public setLink(link:string) {
        this.voiceLink = link
    }

    public setText(text:string) {
        this.text = text
    }

    public getText():string {
        if (this.text === undefined) {
            return ""
        }
        return this.text
    }

    public getLink():string {
        if (this.voiceLink === undefined) {
            return ""
        }
        return this.voiceLink
    }

}
export interface MyContext extends Context {
    session: any;
}

const INITIAL_SESSION = {
    messages: []
}

let client: PrismaClient

let app: Application
let bot: Telegraf<MyContext>
let userRepo: UserRepository
let chatRepo: ChatRepository
let msgRepo: MessageRepository

async function init() {
    client = new PrismaClient()

    userRepo = new UserRepository(client)
    msgRepo = new MessageRepository(client)
    chatRepo = new ChatRepository(client)

    const config = new Config(process.env.OPENAI_KEY, process.env.TELEGRAM_TOKEN)
    // создаем инстанс приложения
    const converter = new Converter()
    const downloader = new FileDownloader()
    const openAI = new OpenAI(config.openAIKey)

    app = new Application(downloader, converter, openAI, userRepo, chatRepo, msgRepo)
    bot = new Telegraf<MyContext>(config.telegramToken)
}


async function main() {
    console.log("init config...");
    init()
    console.log("get config");

    bot.use(session())

    console.log("set session to bot");

    bot.launch()
    console.log("start bot");

    bot.command("new", async (ctx: MyContext) => {
        ctx.session = INITIAL_SESSION
        await ctx.reply("Жду голосовое или текстовое сообщение")
    })


    bot.on(message("text"), async ctx => {
        ctx.session ??= INITIAL_SESSION

        const { id, username, is_bot, language_code } = ctx.message.from

        const botRequest = new TelegramRequst(
            id,
            username ?? "default_name",
            is_bot, language_code ?? "ru",
            ctx.message.chat.id)

        botRequest.setText(ctx.message.text)

        const response = await app.ProcessText(botRequest, ctx.session.messages)

        if (response instanceof Error) {
            console.error(response);
            return 
        }

        ctx.reply(response)

    })

    bot.on("voice", async (ctx) => {
        ctx.session ??= INITIAL_SESSION

        const { id, username, is_bot, language_code } = ctx.message.from

        const botRequest = new TelegramRequst(
            id,
            username ?? "default_name",
            is_bot, language_code ?? "ru",
            ctx.message.chat.id)

        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)

        botRequest.setLink(link.href)
        
        const response = await app.ProcessVoice(botRequest, ctx.session.messages)

        if (response instanceof Error) {
            console.error(response);
            return 
        }

        ctx.reply(response)
    })
}


main()
    .catch(err => {
        console.error(err);
        client.$disconnect()

        process.exit(1)
    })













