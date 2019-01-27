"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../../classes");
const enums_1 = require("../../enums");
class Help extends classes_1.Command {
    constructor() {
        super(__filename);
    }
    get Restrictions() {
        return enums_1.ERestrictions.NONE;
    }
    async run() {
        if (this.HasParameters) {
            const commandName = this.PassedParameters[0];
            const command = this.Bot.Commands.find(cmd => cmd.Data.name === commandName);
            await this.Message.reply(command ?
                `\n${command.help}` : `Unable to find a command with the name "${commandName}"`);
            return;
        }
        this.Message.reply(`Here is a list of the available commands:\n${this.all()}`);
    }
    all() {
        return this.Bot.Commands.map(command => command.help).join('\n');
    }
}
exports.default = Help;
