"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_graceful_shutdown_1 = require("node-graceful-shutdown");
const bot_1 = require("./classes/bot");
const bot = bot_1.default.Instance;
node_graceful_shutdown_1.onShutdown('bot', async () => {
    bot.Logger.info('Shutting down');
    await bot.stop();
    bot.Logger.info('Successfully shutdown');
});
async function start() {
    try {
        bot.Logger.info('Starting bot');
        await bot.start();
        bot.Logger.info('Bot started!');
    }
    catch (error) {
        bot.Logger.error(error);
    }
}
start();
