import * as env from 'env-var'
import { Message as DiscordMessage } from 'discord.js'

import { IBot, IMessage } from '../interfaces'
import { Command } from '.'

export class Message implements IMessage
{
    private bot: IBot
    private discordMessage: DiscordMessage

    constructor(bot: IBot, discordMessage: DiscordMessage)
    {
        this.bot = bot
        this.discordMessage = discordMessage
    }


    /**
     * Get the instance of the bot for this message
     *
     * @readonly
     * @type {IBot}
     * @memberof Message
     */
    public get Bot(): IBot
    {
        return this.bot
    }


    /**
     * Get the prefix
     *
     * @readonly
     * @type {string}
     * @memberof Message
     */
    public get Prefix(): string
    {
        return env.get('DEFAULT_PREFIX').required().asString()
    }


    /**
     * Get the command from this message
     *
     * @readonly
     * @type {(Command|undefined)}
     * @memberof Message
     */
    public get Command(): Command|undefined
    {
        const command: Command = this.bot
            .Commands
            .find(cmd => cmd.Data.name === this.RequestCommand)

        if(!command)
            return undefined

        command.Message = this.discordMessage
        command.Bot = this.bot

        return command
    }

    /**
     * Get the requested command
     *
     * @readonly
     * @type {string}
     * @memberof Message
     */
    public get RequestCommand(): string
    {
        const command = this.Content.split(this.Prefix)[1]

        return (command.indexOf(' ') > -1 ? 
            command.split(' ')[0] : command).toLowerCase().trim()
    }

    /**
     * Get the content of this message
     *
     * @readonly
     * @type {string}
     * @memberof Message
     */
    public get Content(): string
    {
        return this.discordMessage.content
    }

    /**
     * Get the original discord message
     *
     * @readonly
     * @type {DiscordMessage}
     * @memberof Message
     */
    public get Internal(): DiscordMessage
    {
        return this.discordMessage
    }

    /**
     * Check if this message is from a bot
     *
     * @readonly
     * @type {boolean}
     * @memberof Message
     */
    public get IsBot(): boolean
    {
        return this.discordMessage.author.bot
    }

    /**
     * Check if this message is a command
     *
     * @readonly
     * @type {boolean}
     * @memberof Message
     */
    public get IsCommand(): boolean
    {
        return this.Content.substring(0, this.Prefix.length) === this.Prefix
    }
}
