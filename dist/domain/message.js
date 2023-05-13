export class Message {
    number;
    text;
    chatID;
    constructor(text, num, chatID) {
        this.text = text;
        this.number = num;
        this.chatID = chatID;
    }
}
