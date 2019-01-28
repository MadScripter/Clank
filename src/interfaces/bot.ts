import { Collection } from 'discord.js';
import { Command } from '../classes';

export interface IBot
{
    Commands: Collection<string, Command>
    start(): Promise<string>
    stop(): Promise<void>
}
