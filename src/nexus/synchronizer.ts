import {Nexus} from "./core";
import {Command} from "../command/core";
import { Routes } from "discord.js"
import {build} from "../command/translation";

export class Synchronizer {
    public async sync() {
        if (Nexus.client == null) {
            throw Error('No available client to process synchronization.')
        }
        const commands = Nexus.manager.getCommands()
        const serverCommands: Map<string, Command[]> = new Map()
        const globalCommands = [] as Command[]

        for (const command of commands) {
            if (command.server == null) {
                globalCommands.push(command)
                continue
            }

            if (!serverCommands.has(command.server)) {
                serverCommands.set(command.server, [])
            }

            serverCommands.get(command.server)!!.push(command)
        }

        if (globalCommands.length > 0) {
            await Nexus.client.rest.put(
                Routes.applicationCommands(Nexus.client!!.application!!.id),
                { body: globalCommands.map((command) => build(command).toJSON()) }
            )
        }

        for (const entry of serverCommands) {
            const server = entry[0]
            const commands = entry[1]

            await Nexus.client.rest.put(
                Routes.applicationGuildCommands(Nexus.client!!.application!!.id, server),
                { body: commands.map((command) => build(command).toJSON()) }
            )
        }
    }
}