import * as pino from 'pino'
import * as env from 'env-var'
import * as path from 'path'

import { Message as DiscordMessage, GuildMember } from 'discord.js';

import { ICommandConfig, IParam, IBot } from '../interfaces'
import { ERestrictions } from '../enums'
import { Config } from '.'

export abstract class Command
{
    private logger: pino.Logger
    private config: Config
    private data: ICommandConfig
    private enabled: boolean
    private message!: DiscordMessage
    private bot!: IBot

    constructor(filename: string)
    {
        this.config = new Config()
        this.config.load(path.join(path.dirname(filename), 'config.json'))
        
        this.data = this.config.Content as ICommandConfig

        this.logger = pino({ name: `command::${this.data.name}`})

        this.enabled = true
    }

    /**
     * Execute this command
     *
     * @returns {Promise<void>}
     * @memberof Command
     */
    public async execute(): Promise<void>
    {
        // If the command is disabled, don't run it
        if(!this.enabled)
            return
            
        // If the user running the command is not authorized to, don't run
        if(!this.IsAuthorized)
            return

        this.logger.info(`running command: ${this.data.name}`)

        this.run()
    }

    /**
     * Get the logger for a command
     *
     * @readonly
     * @type {pino.Logger}
     * @memberof Command
     */
    public get Logger(): pino.Logger
    {
        return this.logger
    }

    /**
     * Runs a command
     *
     * @protected
     * @abstract
     * @returns {Promise<void>}
     * @memberof Command
     */
    protected abstract async run(): Promise<void>

    /**
     * The restrictions for a command
     *
     * @readonly
     * @protected
     * @abstract
     * @type {ERestrictions}
     * @memberof Command
     */
    protected abstract get Restrictions(): ERestrictions

    /**
     * The config data for a command
     *
     * @readonly
     * @type {ICommandConfig}
     * @memberof Command
     */
    public get Data(): ICommandConfig
    {
        return this.data
    }

    /**
     * Check whether a command is enabled or not
     *
     * @type {boolean}
     * @memberof Command
     */
    public get Enabled(): boolean
    {
        return this.enabled
    }

    /**
     * Set the state of a command
     *
     * @memberof Command
     */
    public set Enabled(value: boolean)
    {
        this.enabled = value
    }

    /**
     * Get the bot instance
     *
     * @type {IBot}
     * @memberof Command
     */
    public get Bot(): IBot
    {
        return this.bot
    }

    /**
     * Assign the instance of the bot to a command
     *
     * @memberof Command
     */
    public set Bot(value: IBot)
    {
        this.bot = value
    }

    /**
     * Get the discord message associated with a command
     *
     * @type {DiscordMessage}
     * @memberof Command
     */
    public get Message(): DiscordMessage
    {
        return this.message
    }

    /**
     * Assign a discord message to a command
     *
     * @memberof Command
     */
    public set Message(message: DiscordMessage)
    {
        this.message = message
    }

    /**
     * Get the user that called a command
     *
     * @readonly
     * @type {GuildMember}
     * @memberof Command
     */
    public get Caller(): GuildMember
    {
        return this.message.member
    }

    /**
     * Check if a command was run by a guild owner
     *
     * @readonly
     * @type {boolean}
     * @memberof Command
     */
    public get IsByAdmin() : boolean
    {
        return (this.message.guild && 
            (this.message.guild.ownerID === this.message.author.id))
    }

    /**
     * Check if a command was run inside a private text channel
     *
     * @readonly
     * @type {boolean}
     * @memberof Command
     */
    public get IsPrivateChannel(): boolean
    {
        return (this.message.channel.type === 'dm' || 
            this.message.channel.type == 'group')
    }

    /**
     * Check if a user is authorized to run a command
     *
     * @readonly
     * @type {boolean}
     * @memberof Command
     */
    public get IsAuthorized() : boolean
    {
        if(this.IsByAdmin)
            return true

        if (this.Restrictions === ERestrictions.ADMIN_ONLY)
            return this.IsByAdmin

        if (this.Restrictions === ERestrictions.PM_ONLY)
            return this.IsPrivateChannel

        if(this.data.roles.length > 0 && !this.IsPrivateChannel)
        {
            return this.message
                .member
                .roles
                .some(r => this.data
                    .roles
                    .map(role => role.toLowerCase()).includes(r.name.toLowerCase()))

        }   
            
        return (this.Restrictions === ERestrictions.NONE)
    }
    
    /**
     * Check if a command was called with parameters
     *
     * @readonly
     * @type {boolean}
     * @memberof Command
     */
    get HasParameters() : boolean
    {
        return (this.PassedParameters.length > 0)
    }

    /**
     * Get the parameters passed to a command
     *
     * @readonly
     * @type {any[]}
     * @memberof Command
     */
    get PassedParameters() : any[]
    {
        // Remove the prefix + command from the message
        let stringsArray: string[] = []
        let args: string = this.message
            .content
            .substring(
                env.get('DEFAULT_PREFIX')
                .required()
                .asString()
                .length + this.data.name.length
            ).trim()
        
        // Match all parameters between double quotes while ignoring case
        const matchedStrings = args.match(/"([^"]+)"/ig)

        if(matchedStrings != null)
        {
            matchedStrings.forEach((str) =>
            {
                args = args.replace(str, '').trim()
            })

            // Add parameters to the array and remove double quotes from each entry
            stringsArray = matchedStrings
                .map((str) => str.replace(/\"/g, ''))
        }
        
        // Return a unique array of parameters and remove empty entries
        return [...new Set(stringsArray.concat(args.split(' ')))]
            .filter(Boolean)
    }


    /**
     * Get the parameters listed in the config
     *
     * @readonly
     * @type {string}
     * @memberof Command
     */
    get parameters(): string
    {
        return this.data.params.map((param : IParam) => 
        {
            `[${param.name}](${param.required ? 'required' : 'optional'})`
        }).join(' ')
    }

    /**
     * Get the help block for a command
     *
     * @readonly
     * @type {string}
     * @memberof Command
     */
    get help(): string
    {
        let details = `— **${env.get('DEFAULT_PREFIX').asString()}${this.data.name}**`
        
        if(this.data.description)
            details = details.concat(` - *${this.data.description}*`)

        if(this.data.params.length > 0)
            details = details.concat(`\n  └ Parameters: \`${this.parameters}\``)

        return details
    }
}