
export class Message {
    readonly number:number
    readonly text:string
    readonly chatID:number
    
    constructor(text:string, num:number, chatID:number) {
        this.text = text
        this.number = num
        this.chatID = chatID
    }
}