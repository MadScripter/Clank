import { onShutdown } from 'node-graceful-shutdown'
import { Bot } from "./classes"

const bot = Bot.Instance

onShutdown('bot', async() => 
{
    bot.Logger.info('Shutting down')

    await bot.stop()
})

async function start(): Promise<void>
{
    try
    {
        await bot.start()

        bot.Logger.info('Bot started!')
    }
    catch(error)
    {
        bot.Logger.error(error)
    }
}

start()
