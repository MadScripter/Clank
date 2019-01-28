import * as pino from 'pino'
import * as dotprop from 'dot-prop'
import { pathExistsSync, readJSONSync, writeJSON } from 'fs-extra'

export class Config
{
    private logger: pino.Logger
    private path: string
    private content: any

    constructor()
    {
        this.path = ''
        this.content = undefined
        this.logger = pino({
            name: 'config'
        })
    }

    /**
     * Loads the config.json file at the specified path
     *
     * @param {string} path
     * @memberof Config
     */
    public load(path: string): void
    {
        // this.logger.info(`loading config at ${path}`)

        const exists = pathExistsSync(path)

        if(!exists)
            throw new Error('config.json is missing')

        const content = readJSONSync(path, { throws: true })

        this.content = content
    }

    /**
     * Saves the current config
     *
     * @memberof Config
     */
    public save(): void
    {
        writeJSON(this.path, this.content, { spaces: 4 }).catch(this.logger.error)
    }

    /**
     * Get a specific key from the config
     *
     * @param {string} key
     * @returns {*}
     * @memberof Config
     */
    public get(key: string): any
    {
        return dotprop.get(this.content, key)
    }

    /**
     * Set the value for a specific key in the config
     *
     * @param {string} key
     * @param {*} value
     * @memberof Config
     */
    public set(key: string, value: any): void
    {
        dotprop.set(this.content, key, value)
    }

    /**
     * Check if the config has a specific key
     *
     * @param {string} key
     * @returns {boolean}
     * @memberof Config
     */
    public has(key: string): boolean
    {
        return dotprop.has(this.content, key)
    }

    /**
     * Delete a key from the config
     *
     * @param {string} key
     * @returns {boolean}
     * @memberof Config
     */
    public delete(key: string): boolean
    {
        return dotprop.delete(this.content, key)
    }

    /**
     * Get the content of the config
     *
     * @readonly
     * @type {*}
     * @memberof Config
     */
    public get Content(): any
    {
        return this.content
    }
}