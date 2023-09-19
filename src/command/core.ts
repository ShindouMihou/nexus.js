import {
    ChatInputCommandInteraction,
    SlashCommandAttachmentOption,
    SlashCommandBooleanOption,
    SlashCommandChannelOption,
    SlashCommandIntegerOption,
    SlashCommandMentionableOption, SlashCommandNumberOption, SlashCommandRoleOption,
    SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder,
    SlashCommandUserOption
} from "discord.js";
import { Nexus } from "../nexus/core"

export type SlashCommandOption = SlashCommandStringOption |
    SlashCommandBooleanOption |
    SlashCommandIntegerOption |
    SlashCommandChannelOption |
    SlashCommandUserOption |
    SlashCommandRoleOption |
    SlashCommandMentionableOption |
    SlashCommandAttachmentOption |
    SlashCommandNumberOption |
    SlashCommandSubcommandBuilder |
    SlashCommandSubcommandGroupBuilder

export type Command = {
    /**
     * The unique identifier of the command. This is used by the command manager to help distinguish between
     * two commands that have the same name, you can set this yourself if you'd like, but generally, just leave it
     * alone and let the command manager auto-generate one.
     */
    uuid?: string,

    /**
     * The name of the command.
     */
    name: string

    /**
     * The description of the command.
     */
    description: string

    /**
     * The options to include for this command.
     */
    options?: SlashCommandOption[]

    /**
     * The id of the guild (or server) to add the command towards, set this as undefined
     * to make the command as a global command.
     */
    server?: string

    /**
     * Whether to indicate this command as NSFW or not.
     */
    nsfw?: boolean

    /**
     * The default permissions for members needed in the server.
     */
    defaultMemberPermissions?: string | number | bigint | null | undefined

    /**
     * Whether to enable this command for DMs (private messages).
     */
    dmPermission?: boolean,

    /**
     * The names of the middlewares to include for this command.
     * To create a middleware, use {@link Nexus.middlewares}.
     *
     * Middlewares are those executed before the command is dispatched, these are intended for things such as common
     * user role permission checking, or anything similar that can be extracted elsewhere. This is the same concept
     * as web frameworks' middlewares and can stop the command from being dispatched.
     *
     * {@link Nexus.globals.middlewares} takes a higher position than the command middlewares, which means those middlewares
     * under {@link Nexus.globals.middlewares} are executed before the command's own middlewares.
     */
    middlewares?: string[],

    /**
     * The names of the afterwares to include for this command.
     * To create an afterware, use {@link Nexus.afterwares}.
     *
     * Afterwares are additional tasks that are to be executed after the command is dispatched, emphasis on dispatched,
     * which means this will be executed quite parallel with the command (although, with the single-threaded nature
     * of Javascript, this should be about as soon as there is an idle time with the thread after dispatching).
     *
     * {@link Nexus.globals.afterwares} takes a higher position than the command afterwares, which means those afterwares
     * under {@link Nexus.globals.afterwares} are executed before the command's own afterwares.
     */
    afterwares?: string[],

    /**
     * The handler for the command, which will be dispatched whenever an event is received for the command.
     * @param ev the event that was received.
     */
    handler: (ev: ChatInputCommandInteraction) => void | Promise<void>
}