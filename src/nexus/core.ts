import {CommandManager} from "../command/manager";
import {dispatch} from "../command/dispatcher";
import {ChatInputCommandInteraction, Client, Interaction} from "discord.js";
import {Command} from "../command/core";
import {Synchronizer} from "./synchronizer";
import {Afterware, Middleware} from "./interceptors";

type _Nexus = {
    /**
     * Middlewares are those executed before the command is dispatched, these are intended for things such as common
     * user role permission checking, or anything similar that can be extracted elsewhere. This is the same concept
     * as web frameworks' middlewares and can stop the command from being dispatched.
     *
     * To add a middleware, simply add the middleware here with a name (e.g. `nexus.auth.roles`).
     *
     * To add a global middleware, use {@link Nexus.globals.middlewares}.
     */
    middlewares: Map<string, Middleware>,

    /**
     * Afterwares are additional tasks that are to be executed after the command is dispatched, emphasis on dispatched,
     * which means this will be executed quite parallel with the command (although, with the single-threaded nature
     * of Javascript, this should be about as soon as there is an idle time with the thread after dispatching).
     *
     * To add an afterware, simply add the afterware here with a name (e.g. `nexus.log`).
     *
     * To add a global afterware, use {@link Nexus.globals.afterwares}.
     */
    afterwares: Map<string, Afterware>,

    /**
     * Global options in Nexus, such as global middlewares and afterwares that are included in every command.
     */
    globals: {
        /**
         * All the middlewares that will be included in all commands. Note that these take a higher position than
         * the command middlewares themselves, so they will be executed first before the actual command's middlewares.
         *
         * Middlewares are those executed before the command is dispatched, these are intended for things such as common
         * user role permission checking, or anything similar that can be extracted elsewhere. This is the same concept
         * as web frameworks' middlewares and can stop the command from being dispatched.
         *
         * To add a middleware, use {@link Nexus.middlewares} instead.
         */
        middlewares: string[],

        /**
         * All the afterwares that will be included in all commands. Note that these take a higher position than
         * the command afterwares themselves, so they will be executed first before the actual command's afterwares.
         *
         * Afterwares are additional tasks that are to be executed after the command is dispatched, emphasis on dispatched,
         * which means this will be executed quite parallel with the command (although, with the single-threaded nature
         * of Javascript, this should be about as soon as there is an idle time with the thread after dispatching).
         *
         * To add an afterware, use {@link Nexus.afterwares} instead.
         */
        afterwares: string[]
    },

    /**
     * The command manager in Nexus. This is where all the commands' indexes and instances are registered, and where
     * the command selection happens for each event. It is generally recommended to keep this as usual.
     */
    manager: CommandManager,

    /**
     * The dispatcher that will dispatch the event to the command's handler, which handles the execution of middlewares
     * and afterwares. It is generally recommended to keep this as usual, but if you don't like the default behavior,
     * you can use your own dispatcher instead.
     *
     * @param command the command to execute.
     * @param ev the event that was received.
     */
    dispatcher: (command: Command, ev: ChatInputCommandInteraction) => void | Promise<void>,

    /**
     * The {@link Client} from Discord.js, we use this in areas such as {@link Synchronizer}. It's recommend to set this
     * as soon as the client is ready and before anything is done.
     */
    client?: Client<true>,

    /**
     * The synchronizer that helps synchronize the commands from the command registry to Discord. This will
     * handle synchronizing global and server commands using bulk overwrite.
     */
    synchronizer: Synchronizer,

    /**
     * Used to receive interaction events from {@link Client}, this only takes in {@link ChatInputCommandInteraction} which
     * means anything else is ignored.
     *
     * @param interaction the interaction received.
     */
    onInteractionCreate: (interaction: Interaction) => void
}
export const Nexus: _Nexus = {
    middlewares: new Map(),
    afterwares: new Map(),
    globals: {
        middlewares: [],
        afterwares: []
    },
    manager: new CommandManager(),
    dispatcher: dispatch,
    client: undefined,
    synchronizer: new Synchronizer(),
    onInteractionCreate: onInteractionCreate
}

function onInteractionCreate(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return
    const command = Nexus.manager.accept(interaction as ChatInputCommandInteraction)
    if (command == null) {
        throw Error('Unknown command ' + interaction.commandName)
    }

    Nexus.dispatcher(command, interaction)
}