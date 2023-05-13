export class Config {
    openAIKey;
    telegramToken;
    constructor(openAIKey = "", telegramToken = "") {
        this.openAIKey = openAIKey;
        this.telegramToken = telegramToken;
        if (this.validate() instanceof Error) {
            throw this.validate();
        }
    }
    validate() {
        if (this.telegramToken === "") {
            return new Error("empty telegram token");
        }
        if (this.openAIKey === "") {
            return new Error("empty openAI token");
        }
        return null;
    }
}
