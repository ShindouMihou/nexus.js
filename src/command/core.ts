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
    uuid?: string,
    name: string
    description: string
    options?: SlashCommandOption[]
    server?: string
    nsfw?: boolean
    defaultMemberPermissions?: string | number | bigint | null | undefined
    dmPermission?: boolean,
    middlewares?: string[],
    afterwares?: string[],
    handler: (ev: ChatInputCommandInteraction) => void | Promise<void>
}