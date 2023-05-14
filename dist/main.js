import { Telegraf, session } from "telegraf";
import { Converter } from "./infra/converter.js";
import { Application } from "./app.js";
import { FileDownloader } from "./infra/fileDownloader.js";
import { OpenAI } from "./infra/openAI.js";
import { message } from "telegraf/filters";
import { Config } from "./config.js";
import { UserRepository } from "./repository/user_repositoty.js";
import { User } from "./domain/user.js";
import { MessageRepository } from "./repository/message_reposiroty.js";
import { Message } from "./domain/message.js";
import { ChatRepository } from "./repository/chat_repository.js";
import { Chat } from "./domain/chat.js";
import { PrismaClient } from "@prisma/client";
const INITIAL_SESSION = {
    messages: []
};
let client;
let app;
let bot;
let userRepo;
let chatRepo;
let msgRepo;
async function init() {
    client = new PrismaClient();
    userRepo = new UserRepository(client);
    msgRepo = new MessageRepository(client);
    chatRepo = new ChatRepository(client);
    const config = new Config(process.env.OPENAI_KEY, process.env.TELEGRAM_TOKEN);
    // создаем инстанс приложения
    const converter = new Converter();
    const downloader = new FileDownloader();
    const openAI = new OpenAI(config.openAIKey);
    app = new Application(downloader, converter, openAI);
    bot = new Telegraf(config.telegramToken);
}
async function main() {
    console.log("init config...");
    init();
    console.log("get config");
    bot.use(session());
    console.log("set session to bot");
    bot.launch();
    console.log("start bot");
    bot.command("new", async (ctx) => {
        ctx.session = INITIAL_SESSION;
        await ctx.reply("Жду голосовое или текстовое сообщение");
    });
    bot.on(message("text"), async (ctx) => {
        ctx.session ??= INITIAL_SESSION;
        const { id, username, is_bot, language_code } = ctx.message.from;
        const user = new User(id, username ?? "no_name", language_code ?? "ru", is_bot);
        const chat = new Chat(ctx.message.chat.id);
        const msg = new Message(ctx.message.text, id);
        const [savedChat, chatErr] = await chatRepo.Save(chat);
        if (chatErr !== null) {
            throw chatErr;
        }
        const [savedUser, userErr] = await userRepo.SaveIfNotExist(user);
        if (userErr !== null) {
            throw userErr;
        }
        ctx.session.messages.push({ "role": "user", content: msg.text });
        let err = await msgRepo.SaveMessage(user, msg, "USER", "TEXT", chat.telegramID);
        if (err !== null) {
            throw err;
        }
        const respone = await app.Text(ctx);
        err = await msgRepo.SaveMessage(user, new Message(respone, id), "GPT", "TEXT", chat.telegramID);
        if (err !== null) {
            throw err;
        }
    });
    bot.on("voice", async (ctx) => {
        ctx.session ??= INITIAL_SESSION;
        console.log("start processing voice message");
        const { id, username, is_bot, language_code } = ctx.message.from;
        const user = new User(id, username ?? "no_name", language_code ?? "ru", is_bot);
        const chat = new Chat(ctx.message.chat.id);
        const [savedChat, chatErr] = await chatRepo.Save(chat);
        if (chatErr !== null) {
            throw chatErr;
        }
        const [savedUser, userErr] = await userRepo.SaveIfNotExist(user);
        if (userErr !== null) {
            throw userErr;
        }
        const fileID = ctx.message.voice.file_id;
        console.log("fileID", fileID);
        const link = await ctx.telegram.getFileLink(fileID);
        console.log("link", link.href);
        const userID = String(ctx.message.from.id);
        console.log("userID", userID);
        const text = await app.Voice(ctx, link.href, userID);
        let err = await msgRepo.SaveMessage(user, new Message(text, id), "USER", "VOICE", chat.telegramID);
        if (err !== null) {
            throw err;
        }
        ctx.session.messages.push({ "role": "user", content: text });
        const respone = await app.Text(ctx);
        err = await msgRepo.SaveMessage(user, new Message(respone, id), "GPT", "TEXT", chat.telegramID);
        if (err !== null) {
            throw err;
        }
    });
}
main()
    .catch(err => {
    console.error(err);
    client.$disconnect();
    process.exit(1);
});
