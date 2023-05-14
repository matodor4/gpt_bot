
export class Message {
    readonly text:string
    readonly chatID:number
    
    constructor(text:string, chatID:number) {
        this.text = text
        this.chatID = chatID
    }
}