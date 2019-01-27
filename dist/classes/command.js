"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pino = require("pino");
const env = require("env-var");
const path = require("path");
const enums_1 = require("../enums");
const config_1 = require("./config");
class Command {
    constructor(filename) {
        this.config = new config_1.default();
        this.config.load(path.join(path.dirname(filename), 'config.json'));
        this.data = this.config.Content;
        this.logger = pino({ name: `command:${this.data.name}` });
        this.logger.info(`Initiliazed command: ${this.data.name}`);
    }
    async execute() {
        if (!this.IsAuthorized)
            return;
        this.logger.info(`running command: ${this.data.name}`);
        this.run();
    }
    get Logger() {
        return this.logger;
    }
    get Data() {
        return this.data;
    }
    get Bot() {
        return this.bot;
    }
    set Bot(bot) {
        this.bot = bot;
    }
    get Message() {
        return this.message;
    }
    set Message(message) {
        this.message = message;
    }
    get Caller() {
        return this.message.member;
    }
    get IsByAdmin() {
        return (this.message.guild &&
            (this.message.guild.ownerID === this.message.author.id));
    }
    get IsPrivateChannel() {
        return (this.message.channel.type === 'dm' ||
            this.message.channel.type == 'group');
    }
    get IsAuthorized() {
        if (this.IsByAdmin)
            return true;
        if (this.data.roles.length > 0 && !this.IsPrivateChannel) {
            return this.message
                .member
                .roles
                .some(r => this.data
                .roles
                .map(role => role.toLowerCase()).includes(r.name.toLowerCase()));
        }
        if (this.Restrictions === enums_1.ERestrictions.ADMIN_ONLY)
            return this.IsByAdmin;
        if (this.Restrictions === enums_1.ERestrictions.PM_ONLY)
            return this.IsPrivateChannel;
        return (this.Restrictions === enums_1.ERestrictions.NONE);
    }
    get HasParameters() {
        return (this.PassedParameters.length > 0);
    }
    get PassedParameters() {
        let stringsArray = [];
        let args = this.message
            .content
            .substring(env.get('DEFAULT_PREFIX')
            .required()
            .asString()
            .length + this.data.name.length).trim();
        const matchedStrings = args.match(/"([^"]+)"/ig);
        if (matchedStrings != null) {
            matchedStrings.forEach((str) => {
                args = args.replace(str, '').trim();
            });
            stringsArray = matchedStrings
                .map((str) => str.replace(/\"/g, ''));
        }
        return [...new Set(stringsArray.concat(args.split(' ')))];
    }
    get parameters() {
        return this.data.params.map((param) => {
            `[${param.name}](${param.required ? 'required' : 'optional'})`;
        }).join(' ');
    }
    get help() {
        let details = `— **${process.env.DEFAULT_PREFIX}${this.data.name}**`;
        if (this.data.description)
            details = details.concat(` - *${this.data.description}*`);
        if (this.data.params.length > 0)
            details = details.concat(`\n  └ Parameters: \`${this.parameters}\``);
        return details;
    }
}
exports.Command = Command;
