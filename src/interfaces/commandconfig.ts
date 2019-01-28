import { IParam } from "."

export interface ICommandConfig
{
    readonly name: string
    readonly description: string
    readonly params: IParam[]
    readonly roles: string[]
    readonly permissions?: string[]
}