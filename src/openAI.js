import { Configuration, OpenAIApi } from "openai";
import config from "config"
import {createReadStream} from "fs";

class OpenAI {
    constructor(apiKey) {
        const configuration = new Configuration({
            apiKey
        });
        this.openai = new OpenAIApi(configuration)
    }


    chat() {}

    async transcription(filePath) {
        try{
            const response = await this.openai.createTranscription(
                createReadStream(filePath),
                "whisper-1"
            )
            return response.data.text
        } catch (e) {
            console.log("error while transcription", e.message)
        }
    }
}

export const openai = new OpenAIApi(config.get("OPENAI_KEY"))