import { User } from "../domain/user.js";
export class ContextHandler {
    ctx;
    constructor(ctx) {
        if (ctx === undefined) {
            throw new Error("failed to get telegram context");
        }
        this.ctx = ctx;
    }
    getUser() {
        const { id, username, is_bot, language_code } = this.ctx.message.from;
        const user = new User(id, username ?? "no_name", language_code ?? "ru", is_bot);
    }
}
