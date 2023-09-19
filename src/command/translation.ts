import {
    ApplicationCommandOptionType, SlashCommandAttachmentOption,
    SlashCommandBooleanOption,
    SlashCommandBuilder,
    SlashCommandChannelOption,
    SlashCommandIntegerOption, SlashCommandMentionableOption, SlashCommandNumberOption,
    SlashCommandRoleOption,
    SlashCommandStringOption,
    SlashCommandSubcommandBuilder,
    SlashCommandSubcommandGroupBuilder, SlashCommandUserOption
} from "discord.js";
import {Command} from "./core";

/**
 * Translates the {@link Command} instance into an useable {@link SlashCommandBuilder} instance.
 * @param command the command to translate.
 */
export function build(command: Command): SlashCommandBuilder {
    const builder = new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description)

    if (command.nsfw != null) {
        builder.setNSFW(command.nsfw)
    }

    if (command.defaultMemberPermissions != null) {
        builder.setDefaultMemberPermissions(command.defaultMemberPermissions)
    }

    if (command.dmPermission != null) {
        builder.setDMPermission(command.dmPermission)
    }

    if (command.options != null) {
        for (const option of command.options) {
            //@ts-ignore
            if (option.type == null) {
                if (option instanceof SlashCommandSubcommandGroupBuilder) {
                    builder.addSubcommandGroup(option)
                    continue
                } else if (option instanceof SlashCommandSubcommandBuilder) {
                    builder.addSubcommand(option)
                    continue
                }
            }

            //@ts-ignore
            switch (option.type) {
                case ApplicationCommandOptionType.String:
                    builder.addStringOption(option as SlashCommandStringOption)
                    break
                case ApplicationCommandOptionType.Boolean:
                    builder.addBooleanOption(option as SlashCommandBooleanOption)
                    break
                case ApplicationCommandOptionType.Channel:
                    builder.addChannelOption(option as SlashCommandChannelOption)
                    break
                case ApplicationCommandOptionType.Integer:
                    builder.addIntegerOption(option as SlashCommandIntegerOption)
                    break
                case ApplicationCommandOptionType.Role:
                    builder.addRoleOption(option as SlashCommandRoleOption)
                    break
                case ApplicationCommandOptionType.Attachment:
                    builder.addAttachmentOption(option as SlashCommandAttachmentOption)
                    break
                case ApplicationCommandOptionType.Number:
                    builder.addNumberOption(option as SlashCommandNumberOption)
                    break
                case ApplicationCommandOptionType.Mentionable:
                    builder.addMentionableOption(option as SlashCommandMentionableOption)
                    break
                case ApplicationCommandOptionType.User:
                    builder.addUserOption(option as SlashCommandUserOption)
                    break
            }
        }
    }
    return builder
}