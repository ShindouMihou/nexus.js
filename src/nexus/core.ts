import {CommandManager} from "../command/manager";
import {dispatch} from "../command/dispatcher";
import {ChatInputCommandInteraction, Client, Interaction} from "discord.js";
import {Command} from "../command/core";
import {Synchronizer} from "./synchronizer";
import {Afterware, Middleware} from "./interceptors";

type _Nexus = {
    middlewares: Map<string, Middleware>,
    afterwares: Map<string, Afterware>,
    globals: {
        middlewares: string[],
        afterwares: string[]
    },
    manager: CommandManager,
    dispatcher: (command: Command, ev: ChatInputCommandInteraction) => void | Promise<void>,
    client?: Client<true>,
    synchronizer: Synchronizer,
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