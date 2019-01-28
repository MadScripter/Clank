import { Command } from "../../classes";
import { ERestrictions } from "../../enums";
import { ICommand } from "../../interfaces/command";

export default class Help extends Command implements ICommand
{
    constructor()
    {
        super(__filename)
    }

    get Restrictions(): ERestrictions
    {
        return ERestrictions.NONE
    }

    async run(): Promise<void>
    {
        if(this.HasParameters)
        {
            const commandName: string = this.PassedParameters[0]
            const command: Command|undefined = this.Bot.Commands.find(cmd => cmd.Data.name == commandName)
            
            await this.Message.reply(command ? 
                `\n${command.help}` : `Unable to find a command with the name "${commandName}"`)

            return
        }
        
        this.Message.reply(`Here is a list of the available commands:\n${this.all()}`)
    }

    private all(): string
    {
        return this.Bot.Commands.map(command => command.help).join('\n')
    }
}