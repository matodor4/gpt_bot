import {User as UserDTO} from '@prisma/client'
export class User {
    readonly telegramID:string
    readonly name :string
    constructor(telegramID:string, name:string) {
        this.telegramID = telegramID
        this.name = name
    }
}

export function UserFromDTO(dto:UserDTO): User {
    return new User(
        dto.telegramID,
        dto.name
    )
}