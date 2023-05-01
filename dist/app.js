export class Application {
    downloader;
    converter;
    openAI;
    constructor(downloader, converter, openAI) {
        this.downloader = downloader;
        this.converter = converter;
        this.openAI = openAI;
    }
    async Voice(href, telegramUserID) {
        try {
            const oggFilePath = await this.downloader.Fetch(href, telegramUserID);
            const mp3FilePath = await this.converter.ToMp3(oggFilePath, telegramUserID);
            const text = await this.openAI.transcription(mp3FilePath);
            console.log("voice to text", text);
            const messages = [{ "role": "user", content: text }];
            return this.openAI.chat(messages);
        }
        catch (err) {
            const errMsg = err.message;
            console.log(errMsg);
            throw err;
        }
    }
}
