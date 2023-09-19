import {Command} from "./core";
import {ChatInputCommandInteraction} from "discord.js";
import {Nexus} from "../nexus/core";

/**
 * Dispatches the command, handling middlewares and other cases.
 *
 * @param command the command to dispatch.
 * @param ev the event to dispatch to the {@link Command.handler}.
 */
export async function dispatch(command: Command, ev: ChatInputCommandInteraction) {
    const middlewares = Nexus.globals.middlewares ?? []
    const afterwares = Nexus.globals.afterwares ?? []

    middlewares.push(...(command.middlewares ?? []))
    afterwares.push(...(command.afterwares ?? []))

    for (const name of middlewares) {
        const middleware = Nexus.middlewares.get(name)
        if (middleware == null) {
            throw Error('Middleware ' + name + ' cannot be found.')
        }
        if (!await middleware(ev)) {
            return
        }
    }

    command.handler(ev)

    for (const name of afterwares) {
        const afterware = Nexus.afterwares.get(name)
        if (afterware == null) {
            throw Error('Afterware ' + name + ' cannot be found.')
        }
        afterware(ev)
    }
}