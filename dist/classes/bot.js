"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pino = require("pino");
const Discord = require("discord.js");
const path = require("path");
const fs_extra_1 = require("fs-extra");
const _1 = require(".");
class Bot {
    constructor() {
        this.logger = pino({ name: 'bot' });
        this.client = new Discord.Client();
        this.commands = [];
        this.handleEvents();
    }
    static get Instance() {
        return this.instance || (this.instance = new this());
    }
    get Logger() {
        return this.logger;
    }
    get Commands() {
        return this.commands;
    }
    async start() {
        try {
            await this.loadCommands();
            await this.client.login(process.env.CLIENT_TOKEN);
            return true;
        }
        catch (error) {
            this.logger.error(error);
            return false;
        }
    }
    async stop() {
        return this.client.destroy();
    }
    async loadCommands() {
        try {
            const commandsPath = path.join(__dirname, '../commands');
            const commands = await fs_extra_1.readdir(commandsPath);
            this.logger.info(`${commands.length} commands to be loaded`);
            for (const command of commands) {
                const commandModule = await (await Promise.resolve().then(() => require(path.join(commandsPath, command)))).default;
                const instance = new commandModule();
                if (!this.commands.includes(instance)) {
                    this.commands.push(instance);
                    this.logger.info(`command <${instance.Data.name}> loaded`);
                }
            }
        }
        catch (error) {
            this.logger.error(error);
        }
    }
    handleEvents() {
        this.client.on('ready', this.onReady.bind(this));
        this.client.on('disconnect', this.onDisconnect.bind(this));
        this.client.on('message', this.onMessage.bind(this));
        this.client.on('error', this.onError.bind(this));
    }
    onReady() {
        this.logger.info('Ready');
    }
    onDisconnect(event) {
        this.logger.info('Disconnected');
    }
    async onMessage(discordMessage) {
        const message = new _1.Message(this, discordMessage);
        if (message.IsBot)
            return;
        if (message.IsCommand)
            message.Command.execute();
    }
    onError(error) {
    }
}
exports.default = Bot;
