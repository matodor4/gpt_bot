export class Application {
    downloader;
    converter;
    openAI;
    constructor(downloader, converter, openAI) {
        this.downloader = downloader;
        this.converter = converter;
        this.openAI = openAI;
    }
    async Voice(ctx, href, telegramUserID) {
        const oggFilePath = await this.downloader.Fetch(href, telegramUserID);
        const mp3FilePath = await this.converter.ToMp3(oggFilePath, telegramUserID);
        const text = await this.openAI.transcription(mp3FilePath);
        return text;
    }
    async Text(ctx) {
        const resp = await this.openAI.chat(ctx.session.messages);
        ctx.session.messages.push({
            role: "assistant",
            content: resp.content,
        });
        ctx.reply(resp.content);
        return resp.content;
    }
}
