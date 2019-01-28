import { ERestrictions } from "../enums";

export interface ICommand
{
    readonly Restrictions: ERestrictions
    run(): Promise<void>
}