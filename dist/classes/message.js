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
            .find(cmd => cmd.Data.name === this.RequestCommand);
        if (!command)
            return undefined;
        command.Message = this.discordMessage;
        command.Bot = this.bot;
        return command;
    }
    get RequestCommand() {
        const command = this.Content.split(this.Prefix)[1];
        return (command.indexOf(' ') > -1 ?
            command.split(' ')[0] : command).toLowerCase().trim();
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
        return this.Content.substring(0, this.Prefix.length) === this.Prefix;
    }
}
exports.Message = Message;
