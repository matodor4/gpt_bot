import {user as UserDTO} from '@prisma/client'
export class User {
    readonly telegramID:number
    readonly name :string
    readonly isBot: boolean
    readonly languageCode: string
    constructor(telegramID:number, name:string, langCode:string, isBot:boolean) {
        this.telegramID = telegramID
        this.name = name
        this.isBot = isBot
        this.languageCode = langCode
    }
}

export function UserFromDTO(dto:UserDTO): User {
    return new User(
        dto.telegramID,
        dto.name,
        "ru",
        false
    )
}