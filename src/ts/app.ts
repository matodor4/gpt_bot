import { FileDownloader } from "./infra/fileDownloader.js";
import { Converter } from "./infra/converter.js";
import { OpenAI } from "./infra/openAI.js";
import { User } from "./domain/user.js";
import {
    ChatCompletionRequestMessage,
    ChatCompletionResponseMessage
} from "openai/api.js";
import { resolve } from "path";
import { Context } from "telegraf";
import { MyContext, TelegramRequst } from "./main.js";
import { PairPromiseResult } from "./repository/user_repositoty.js";
import { Chat } from "./domain/chat.js";
import { Message } from "./domain/message.js";

interface IUserStorage {
    SaveIfNotExist(user: User): Promise<null | Error>
}

interface IChatStorage {
    Save(user: Chat): Promise<null | Error>
}

interface IMessageStorage {
    SaveMessage(user: Message): Promise<null | Error>
}



export class Application {
    private downloader: FileDownloader
    private converter: Converter
    private openAI: OpenAI
    private userStorage: IUserStorage
    private chatStorage: IChatStorage
    private messageStorage: IMessageStorage

    constructor(
        downloader: FileDownloader,
        converter: Converter,
        openAI: OpenAI,
        userStorage: IUserStorage,
        chatStorage: IChatStorage,
        messageStorage: IMessageStorage
    ) {
        this.downloader = downloader
        this.converter = converter
        this.openAI = openAI
        this.userStorage = userStorage
        this.chatStorage = chatStorage
        this.messageStorage = messageStorage
    }

    async ProcessText(request: TelegramRequst, msgs: any): Promise<string | Error> {
        const user = new User(
            request.userID,
            request.userName,
            request.languageCode,
            request.isBot)
            
        let err = await this.userStorage.SaveIfNotExist(user)
        if (err !== null) {
            return err
        }

        const chat = new Chat(request.chatID, "", "")
        err = await this.chatStorage.Save(chat)
        if (err !== null) {
            return err
        }

        let msg = new Message(
            request.getText(),
            request.chatID,
            request.userID,
            "USER",
            "TEXT")

        err = await this.messageStorage.SaveMessage(msg)
        if (err !== null) {
            return err
        }

        msgs.push({
            role: "user",
            content: request.getText(),
        })

        const chatResponse = await this.openAI.chat(msgs)
        
        msgs.push(chatResponse)

        msg = new Message(
            chatResponse.content,
            request.chatID,
            request.userID,
            "GPT",
            "TEXT")

        err = await this.messageStorage.SaveMessage(msg)
        if (err !== null) {
            return err
        }

        return msg.text
    }

    async ProcessVoice(request: TelegramRequst, msgs: any): Promise<string | Error> {
        const user = new User(request.userID, request.userName, request.languageCode, request.isBot)
        let err = await this.userStorage.SaveIfNotExist(user)
        if (err !== null) {
            return err
        }


        const chat = new Chat(request.chatID, "", "")
        err = await this.chatStorage.Save(chat)
        if (err !== null) {
            return err
        }

        const oggFilePath = await this.downloader.Fetch(request.getLink(), request.userID.toString())

        const mp3FilePath = await this.converter.ToMp3(oggFilePath, request.userID.toString())

        const text = await this.openAI.transcription(mp3FilePath)

        let msg = new Message(
            text,
            request.chatID,
            request.userID,
            "USER",
            "VOICE")

        err = await this.messageStorage.SaveMessage(msg)
        if (err !== null) {
            return err
        }

        msgs.push({
            role: "user",
            content: text,
        })

        const chatResponse = await this.openAI.chat(msgs)
        console.log("text", chatResponse);

        msgs.push(chatResponse)


        msg = new Message(
            chatResponse.content,
            request.chatID,
            request.userID,
            "GPT",
            "VOICE")

        err = await this.messageStorage.SaveMessage(msg)
        if (err !== null) {
            return err
        }

        return msg.text

    }

}

