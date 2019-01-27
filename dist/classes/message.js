"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env = require("env-var");
class Message {
    constructor(bot, discordMessage) {
        this.bot = bot;
        this.discordMessage = discordMessage;
    }
    get Bot() {
        return this.bot;
    }
    get Prefix() {
        return env.get('DEFAULT_PREFIX').required().asString();
    }
    get Command() {
        const command = this.bot
            .Commands
            .filter((cmd) => cmd.Data.name === this.RequestCommand)[0];
        if (!command)
            return null;
        command.Message = this.discordMessage;
        command.Bot = this.bot;
        return command;
    }
    get RequestCommand() {
        let command = this.Content.split(this.Prefix)[1];
        return command.indexOf(' ') > -1 ?
            command.split(' ')[0].toLowerCase().trim() : command.toLowerCase().trim();
    }
    get Content() {
        return this.discordMessage.content;
    }
    get Internal() {
        return this.discordMessage;
    }
    get IsBot() {
        return this.discordMessage.author.bot;
    }
    get IsCommand() {
        if ((this.Content.substring(0, this.Prefix.length) === this.Prefix) && !this.IsBot) {
            return this.Command != null;
        }
        return false;
    }
}
exports.Message = Message;
