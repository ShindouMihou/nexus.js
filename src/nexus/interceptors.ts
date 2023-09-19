import {ChatInputCommandInteraction} from "discord.js";

export type Middleware = (ev: ChatInputCommandInteraction) => boolean | Promise<boolean>
export type Afterware = (ev: ChatInputCommandInteraction) => void | Promise<void>