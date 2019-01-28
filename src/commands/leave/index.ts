import { Command } from "../../classes";
import { ERestrictions } from "../../enums";
import { ICommand } from "../../interfaces/command";

export default class Leave extends Command implements ICommand
{
    constructor()
    {
        super(__filename)
    }

    get Restrictions(): ERestrictions
    {
        return ERestrictions.ADMIN_ONLY
    }

    async run(): Promise<void>
    {
        if(this.Message.channel.type != 'text')
            return

        if(!this.Message.guild.available)
            return

        const connection = this.Message.guild.voiceConnection

        if(connection)
        {
            connection.channel.leave()
        }
    }
}