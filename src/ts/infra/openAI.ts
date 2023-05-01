import {OpenAIApi} from "openai";
import {Configuration} from "openai"
import {createReadStream} from "fs";
import {ChatCompletionRequestMessage, ChatCompletionResponseMessage} from "openai";

export class OpenAI {
    openai: OpenAIApi

    constructor(apiKey: string) {
        const configuration = new Configuration({
            apiKey
        });
        this.openai = new OpenAIApi(configuration)
    }

    async transcription(path: string): Promise<string> {
        try {
            const stream: any = createReadStream(path)
            const response = await this.openai.createTranscription(
                stream,
                "whisper-1"
            )
            return response.data.text
        } catch (err: any) {
            console.log(err)
            return err.message
        }
    }

    async chat(messages: ChatCompletionRequestMessage[]) {
        try {

            const response = await this.openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: messages,
            })

            return response.data.choices[0].message

        } catch (err: any) {
            return err.message
        }

    }
}
