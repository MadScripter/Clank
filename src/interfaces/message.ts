import { Message as DiscordMessage } from 'discord.js'
import { IBot } from "./bot";

export interface IMessage
{
    readonly Bot: IBot
    readonly Prefix: string
    readonly IsBot: boolean
    readonly IsCommand: boolean
    readonly Command: any
    readonly RequestCommand: string
    readonly Content: string
    readonly Internal: DiscordMessage
}
