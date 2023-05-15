import { User } from "./domain/user.js";
import { Chat } from "./domain/chat.js";
import { Message } from "./domain/message.js";
export class Application {
    downloader;
    converter;
    openAI;
    userStorage;
    chatStorage;
    messageStorage;
    constructor(downloader, converter, openAI, userStorage, chatStorage, messageStorage) {
        this.downloader = downloader;
        this.converter = converter;
        this.openAI = openAI;
        this.userStorage = userStorage;
        this.chatStorage = chatStorage;
        this.messageStorage = messageStorage;
    }
    async ProcessText(request, msgs) {
        const user = new User(request.userID, request.userName, request.languageCode, request.isBot);
        let err = await this.userStorage.SaveIfNotExist(user);
        if (err !== null) {
            return err;
        }
        const chat = new Chat(request.chatID, "", "");
        err = await this.chatStorage.Save(chat);
        if (err !== null) {
            return err;
        }
        let msg = new Message(request.getText(), request.chatID, request.userID, "USER", "TEXT");
        err = await this.messageStorage.SaveMessage(msg);
        if (err !== null) {
            return err;
        }
        msgs.push({
            role: "user",
            content: request.getText(),
        });
        const chatResponse = await this.openAI.chat(msgs);
        msgs.push(chatResponse);
        msg = new Message(chatResponse.content, request.chatID, request.userID, "GPT", "TEXT");
        err = await this.messageStorage.SaveMessage(msg);
        if (err !== null) {
            return err;
        }
        return msg.text;
    }
    async ProcessVoice(request, msgs) {
        const user = new User(request.userID, request.userName, request.languageCode, request.isBot);
        let err = await this.userStorage.SaveIfNotExist(user);
        if (err !== null) {
            return err;
        }
        const chat = new Chat(request.chatID, "", "");
        err = await this.chatStorage.Save(chat);
        if (err !== null) {
            return err;
        }
        const oggFilePath = await this.downloader.Fetch(request.getLink(), request.userID.toString());
        const mp3FilePath = await this.converter.ToMp3(oggFilePath, request.userID.toString());
        const text = await this.openAI.transcription(mp3FilePath);
        let msg = new Message(text, request.chatID, request.userID, "USER", "VOICE");
        err = await this.messageStorage.SaveMessage(msg);
        if (err !== null) {
            return err;
        }
        msgs.push({
            role: "user",
            content: text,
        });
        const chatResponse = await this.openAI.chat(msgs);
        console.log("text", chatResponse);
        msgs.push(chatResponse);
        msg = new Message(chatResponse.content, request.chatID, request.userID, "GPT", "VOICE");
        err = await this.messageStorage.SaveMessage(msg);
        if (err !== null) {
            return err;
        }
        return msg.text;
    }
}
