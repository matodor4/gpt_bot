import { OpenAIApi } from "openai";
import { Configuration } from "openai";
import { createReadStream } from "fs";
export class OpenAI {
    openai;
    constructor(apiKey) {
        const configuration = new Configuration({
            apiKey
        });
        this.openai = new OpenAIApi(configuration);
    }
    async transcription(path) {
        try {
            const stream = createReadStream(path);
            const response = await this.openai.createTranscription(stream, "whisper-1");
            return response.data.text;
        }
        catch (err) {
            console.log(err);
            return err.message;
        }
    }
    async chat(messages) {
        try {
            const response = await this.openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages,
            });
            return response.data.choices[0].message;
        }
        catch (err) {
            return err.message;
        }
    }
}
