"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_graceful_shutdown_1 = require("node-graceful-shutdown");
const classes_1 = require("./classes");
const bot = classes_1.Bot.Instance;
node_graceful_shutdown_1.onShutdown('bot', async () => {
    bot.Logger.info('Shutting down');
    await bot.stop();
});
async function start() {
    try {
        await bot.start();
        bot.Logger.info('Bot started!');
    }
    catch (error) {
        bot.Logger.error(error);
    }
}
start();
