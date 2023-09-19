import {Command} from "./core";
import {ChatInputCommandInteraction} from "discord.js";

export class CommandManager {
    private indexes: Map<string, CommandIndex> = new Map()
    private commands: Map<string, Command> = new Map()

    /**
     * Gets all the commands in the registry.
     */
    public getCommands(): Command[] {
        return Array.from(this.commands.values())
    }

    /**
     * Adds one command to the registry. If you'd like to easily bulk-add, then feel free to use
     * {@link many} instead.
     *
     * @param command the command to add.
     */
    public add(command: Command) {
        const name = command.name.toLowerCase()
        if (this.commands.has(name) && this.commands.get(name) !== command) {
            command.uuid = name + ':' + Date.now()
        }
        this.commands.set(command.uuid ?? name, command)
    }

    /**
     * Adds one or more commands, simply a short-hand for a for-each that uses {@link add}.
     * @param commands the commands to add.
     */
    public many(...commands: Command[]) {
        commands.forEach(command => this.add(command))
    }

    /**
     * Finds one command that matches the given application id, this will return undefined
     * if the command is not indexed, generally, when used inside a {@link Command.handler}, this should be
     * available for the given command.
     *
     * @param applicationId the command's id.
     */
    public findWithApplicationId(applicationId: string): Command | undefined {
        const index = this.indexes.get(applicationId)?.command
        if (index == null) {
            return undefined
        }
        return this.commands.get(index)
    }

    /**
     * Finds a command given a unique identifier. The unique identifier is generally the {@link Command.name}, but if there are
     * more than one commands with the same name, then a {@link Command.uuid} is generated (if it doesn't exist already).
     *
     * @param uuid the unique identifier of the command.
     */
    public findWithUuid(uuid: string): Command | undefined {
        return this.commands.get(uuid)
    }

    /**
     * Scans through the commands to find the first command that matches the given parameters.
     *
     * @param name the name of the command.
     * @param server the server of the command, or undefined.
     */
    public findWithName(name: string, server: string | undefined): Command | undefined {
        for (let entry of this.commands) {
            const command = entry[1]
            if (command.name.toLowerCase() === name.toLowerCase() && command.server === server) {
                return command
            }
        }
        return undefined
    }

    /**
     * Accepts an {@link ChatInputCommandInteraction} then finds the associated command for it, otherwise,
     * scans for one then indexes it in-memory.
     *
     * @param ev the event to reference from.
     */
    accept(ev: ChatInputCommandInteraction): Command | undefined {
        let command = this.findWithApplicationId(ev.commandId)
        if (command != null) {
            return command
        }

        if (ev.guildId != null) {
            command = this.findWithName(ev.commandName, ev.guildId)
            if (command != null) {
                this.indexes.set(ev.commandId, {
                    id: ev.commandId,
                    command: command.uuid ?? command.name.toLowerCase(),
                    server: ev.guildId
                })
                return command
            }
        }

        command = this.findWithName(ev.commandName, undefined)
        if (command != null) {
            this.indexes.set(ev.commandId, {
                id: ev.commandId,
                command: command.uuid ?? command.name.toLowerCase(),
                server: undefined
            })
        }
        return command
    }
}

export type CommandIndex = {
    id: string,
    command: string,
    server: string | undefined,
}