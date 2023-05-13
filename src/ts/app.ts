import {FileDownloader} from "./infra/fileDownloader.js";
import {Converter} from "./infra/converter.js";
import {OpenAI} from "./infra/openAI.js";
import {
    ChatCompletionRequestMessage,
    ChatCompletionResponseMessage
} from "openai/api.js";
import {resolve} from "path";
import {Context} from "telegraf";
import {MyContext} from "./main.js";

export class Application {
    private downloader: FileDownloader
    private converter: Converter
    private openAI: OpenAI

    constructor(downloader: FileDownloader, converter: Converter, openAI: OpenAI) {
        this.downloader = downloader
        this.converter = converter
        this.openAI = openAI
    }

    async Voice(ctx: MyContext, href: string, telegramUserID: string): Promise<void> {
        try {
            const oggFilePath = await this.downloader.Fetch(href, telegramUserID)

            const mp3FilePath = await this.converter.ToMp3(oggFilePath, telegramUserID)

            const text = await this.openAI.transcription(mp3FilePath)
            console.log("voice to text", text)

            ctx.session.messages.push({"role": "user", content: text})
            const resp = await this.openAI.chat(ctx.session.messages)

            ctx.session.messages.push({
                role: "assistant",
                content: resp.content,
            })
            ctx.reply(resp.content)

        } catch (err: any) {
            const errMsg: string = err.message
            console.log(errMsg)
            throw err
        }
    }
    async Text(ctx: MyContext):Promise<void> {
        ctx.session.messages.push({"role": "user", content: ctx.session.message})
        const resp = await this.openAI.chat(ctx.session.messages)
        ctx.session.messages.push({
            role: "assistant",
            content: resp.content,
        })
        ctx.reply(resp.content)
    }
}

