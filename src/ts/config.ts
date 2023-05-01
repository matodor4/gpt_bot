export class Config {
    readonly openAIKey: string
    readonly telegramToken: string
    constructor(openAIKey: string, telegramToken: string) {
        this.openAIKey = openAIKey
        this.telegramToken = telegramToken
    }
    public validate(): Error|null{
        if (this.telegramToken === "") {
            return new Error("empty telegram token")
        }
        if (this.openAIKey === "") {
            return new Error("empty openAI token")
        }
        return null
    }
}

