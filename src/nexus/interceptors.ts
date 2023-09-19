import {ChatInputCommandInteraction} from "discord.js";

/**
 * Middlewares are those executed before the command is dispatched, these are intended for things such as common
 * user role permission checking, or anything similar that can be extracted elsewhere. This is the same concept
 * as web frameworks' middlewares and can stop the command from being dispatched.
 */
export type Middleware = (ev: ChatInputCommandInteraction) => boolean | Promise<boolean>

/**
 * Afterwares are additional tasks that are to be executed after the command is dispatched, emphasis on dispatched,
 * which means this will be executed quite parallel with the command (although, with the single-threaded nature
 * of Javascript, this should be about as soon as there is an idle time with the thread after dispatching).
 */
export type Afterware = (ev: ChatInputCommandInteraction) => void | Promise<void>