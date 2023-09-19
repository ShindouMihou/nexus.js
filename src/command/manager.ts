import {Command} from "./core";
import {ChatInputCommandInteraction} from "discord.js";

export class CommandManager {
    private indexes: Map<string, CommandIndex> = new Map()
    private commands: Map<string, Command> = new Map()

    public getCommands(): Command[] {
        return Array.from(this.commands.values())
    }

    public add(command: Command) {
        const name = command.name.toLowerCase()
        if (this.commands.has(name) && this.commands.get(name) !== command) {
            command.uuid = name + ':' + Date.now()
        }
        this.commands.set(command.uuid ?? name, command)
    }

    public findWithApplicationId(applicationId: string): Command | undefined {
        const index = this.indexes.get(applicationId)?.command
        if (index == null) {
            return undefined
        }
        return this.commands.get(index)
    }

    public findWithUuid(uuid: string): Command | undefined {
        return this.commands.get(uuid)
    }

    public findWithName(name: string, server: string | undefined): Command | undefined {
        for (let entry of this.commands) {
            const command = entry[1]
            if (command.name.toLowerCase() === name.toLowerCase() && command.server === server) {
                return command
            }
        }
        return undefined
    }

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