import { Command } from "../../classes";
import { ERestrictions } from "../../enums";
import { ICommand } from "../../interfaces/command";

export default class Join extends Command implements ICommand
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

        if(this.Caller.voiceChannel)
        {
            this.Caller.voiceChannel.join()
        }
    }
}