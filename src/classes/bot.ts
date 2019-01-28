import * as path from 'path'
import * as pino from 'pino'
import { readdir } from 'fs-extra'

import { Message as DiscordMessage, Client, Collection } from 'discord.js'

import { IBot } from '../interfaces'
import { Message, Command } from '.'

export class Bot implements IBot
{
    private static instance: Bot
    private logger: pino.Logger
    private client: Client
    private commands: Collection<string, Command>

    private constructor()
    {
        this.logger = pino({ name: 'bot' })
        this.client = new Client()
        this.commands = new Collection()

        this.handleEvents()
    }

    /**
     * Creates or returns an instance of this class
     *
     * @readonly
     * @static
     * @type {Bot}
     * @memberof Bot
     */
    public static get Instance(): Bot
    {
        return this.instance || (this.instance = new this())
    }

    /**
     * Get the logger for this class
     *
     * @readonly
     * @type {pino.Logger}
     * @memberof Bot
     */
    public get Logger(): pino.Logger
    {
        return this.logger
    }

    /**
     * Get all the commands that were loaded
     *
     * @readonly
     * @type {Collection<string, Command>}
     * @memberof Bot
     */
    public get Commands(): Collection<string, Command>
    {
        return this.commands
    }

    /**
     * Starts the bot
     *
     * @returns {Promise<string>}
     * @memberof Bot
     */
    public async start(): Promise<string>
    {
        await this.loadCommands()

        return await this.client.login(process.env.CLIENT_TOKEN)
    }

    /**
     * Stops the bot
     *
     * @returns {Promise<void>}
     * @memberof Bot
     */
    public async stop(): Promise<void>
    {
        return this.client.destroy()
    }


    /**
     * Loads all commands from the commands directory
     *
     * @returns {Promise<void>}
     * @memberof Bot
     */
    public async loadCommands(): Promise<void>
    {
        try
        {
            // Read all commands in the specified directory
            const commandsPath: string = path.join(__dirname, '../commands')
            const files: string[] = await readdir(commandsPath)

            this.logger.info(`${files.length} commands to be loaded`)

            // Loop through all directories and load each module
            for(const file of files)
            {
                const module: any = await( await import(path.join(commandsPath, file)) ).default
                const command: Command = new module()

                this.commands.set(command.Data.name, command)

                this.logger.info(`command <${command.Data.name}> loaded`)
            }
        }
        catch(error)
        {
            this.logger.error(error)
        }
    }


    /**
     * Register bot specific events
     *
     * @private
     * @memberof Bot
     */
    private handleEvents(): void
    {
        this.client.on('ready', this.onReady.bind(this))
        this.client.on('disconnect', this.onDisconnect.bind(this))
        this.client.on('message', this.onMessage.bind(this))
        this.client.on('error', this.onError.bind(this))
    }

    private onReady(): void 
    {
        this.logger.info('Ready')
    }

    private onDisconnect(event: CloseEvent): void 
    {
        this.logger.info('Disconnected')
    }

    private async onMessage(discordMessage: DiscordMessage): Promise<void> 
    {
        const message: Message = new Message(this, discordMessage)
        
        // If the message is from a bot, don't respond
        if(message.IsBot)
            return

        // If the command requested is valid, run it
        if(message.IsCommand)
        {
            const command = message.Command
            
            if(command != undefined)
            {
                command.execute()
            }
        } 
    }

    private onError(error: Error) 
    {
        this.logger.error({ name: error.name, message: error.message })
    }
}
