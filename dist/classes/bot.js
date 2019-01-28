"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const pino = require("pino");
const fs_extra_1 = require("fs-extra");
const discord_js_1 = require("discord.js");
const _1 = require(".");
class Bot {
    constructor() {
        this.logger = pino({ name: 'bot' });
        this.client = new discord_js_1.Client();
        this.commands = new discord_js_1.Collection();
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
        await this.loadCommands();
        return await this.client.login(process.env.CLIENT_TOKEN);
    }
    async stop() {
        return this.client.destroy();
    }
    async loadCommands() {
        try {
            const commandsPath = path.join(__dirname, '../commands');
            const files = await fs_extra_1.readdir(commandsPath);
            this.logger.info(`${files.length} commands to be loaded`);
            for (const file of files) {
                const module = await (await Promise.resolve().then(() => require(path.join(commandsPath, file)))).default;
                const command = new module();
                this.commands.set(command.Data.name, command);
                this.logger.info(`command <${command.Data.name}> loaded`);
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
        if (message.IsCommand) {
            const command = message.Command;
            if (command != undefined) {
                command.execute();
            }
        }
    }
    onError(error) {
        this.logger.error({ name: error.name, message: error.message });
    }
}
exports.Bot = Bot;
