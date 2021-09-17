import Command from "../../struct/Command";
import { Message } from "discord.js";
import { channelMention } from "@discordjs/builders";
import { Argument } from "@ryukobot/discord-akairo";
import { replace } from "../../utils/command";

export default class JoinLeaveCommand extends Command {
	constructor() {
		super("joinleave", {
			aliases: ["joinleave", "welcomemessages"],
			description: "Configure Welcome and Goodbye messages.",
			category: "Configuration",
			userPermissions: ["MANAGE_CHANNELS"],
			args: [
				{
					id: "subcommand",
					type: "string",
				},
				{
					id: "input",
					type: Argument.union("textChannel", "string"),
				},
			],
		});
	}

	async exec(message: Message, args: any): Promise<any> {
		const enabled = this.client.settings.get(
			message.guild!.id,
			"joinLeave",
			false
		);

		switch (args.subcommand) {
			default:
				return message.channel.send({
					embeds: [
						this.embed(
							{
								title: `${
									enabled
										? this.client.emoji.greenCheck
										: this.client.emoji.redX
								} Join/Leave Message Subcommands`,
								description: `**Placeholders:**\n\`(mention\` The User Mention. Ex: ${message.member!.user.toString()}\n\`(username\` The Username of the Member. Ex: ${
									message.member!.user.username
								}\n\`(discriminator\` The Discriminator of the Member. Ex: ${
									message.member!.user.discriminator
								}\n\`(tag\` The Tag of the Member. Ex: ${
									message.member!.user.tag
								}\n\`(id\` The Id of the Member. Ex: ${
									message.member!.user.id
								}`,
								fields: [
									{
										name: "`enable`",
										value: "Enable Join & Leave Messages",
									},
									{
										name: "`disable`",
										value: "Disable Join & Leave Messages",
									},
									{
										name: `\`channel <channel>\``,
										value: `**Current Channel:** ${
											this.client.settings.get(
												message.guild!.id,
												"joinLeaveChannel",
												null
											)
												? `${channelMention(
														this.client.settings.get(
															message.guild!.id,
															"joinLeaveChannel",
															null
														)
												  )}`
												: "None"
										}\nChange the Channel that Join & Leave messages will be sent into`,
									},
									{
										name: "`join <phrase>`",
										value: `**Current Phrase:** ${
											this.client.settings.get(
												message.guild!.id,
												"joinMessage",
												null
											)
												? `\`${this.client.settings.get(
														message.guild!.id,
														"joinMessage",
														null
												  )}\``
												: "None"
										}\nChange the message that will be sent when someone joins`,
									},
									{
										name: "`leave <phrase>`",
										value: `**Current Phrase:** ${
											this.client.settings.get(
												message.guild!.id,
												"leaveMessages",
												null
											)
												? `\`${this.client.settings.get(
														message.guild!.id,
														"leaveMessages",
														null
												  )}\``
												: "None"
										}\nChange the message that will be sent when someone leaves`,
									},
								],
							},
							message
						),
					],
				});

			case "enable":
				if (
					!(await message.guild!.channels.fetch(
						this.client.settings.get(
							message.guild!.id,
							"joinLeaveChannel",
							null
						)
					))
				)
					return message.channel.send({
						embeds: [
							this.error(
								message,
								"Invalid Configuration",
								`You must set a channel first!\nUse \`${message.util?.parsed?.prefix}${message.util?.parsed?.alias} channel <channel>\``
							),
						],
					});

				this.client.settings.set(message.guild!.id, "joinLeave", true);

				message.channel.send({
					embeds: [
						this.embed(
							{
								title: `${this.client.emoji.greenCheck} Enabled Join & Leave Messages`,
								description: `They will be sent into ${channelMention(
									this.client.settings.get(
										message.guild!.id,
										"joinLeaveChannel",
										null
									)
								)}`,
							},
							message
						),
					],
				});
				break;

			case "disable":
				this.client.settings.set(message.guild!.id, "joinLeave", false);

				message.channel.send({
					embeds: [
						this.embed(
							{
								title: `${this.client.emoji.greenCheck} Disabled Join & Leave Messages`,
							},
							message
						),
					],
				});
				break;
			case "channel":
				if (!args.input || typeof args.input == "string")
					return message.channel.send({
						embeds: [
							this.error(
								message,
								"Invalid Arguments",
								`That is not a valid Text Channel!`
							),
						],
					});

				const oldChannel = this.client.settings.get(
					message.guild!.id,
					"joinLeaveChannel",
					null
				);

				this.client.settings.set(
					message.guild!.id,
					"joinLeaveChannel",
					args.input.id
				);

				message.channel.send({
					embeds: [
						this.embed(
							{
								title: `${this.client.emoji.greenCheck} Changed Join & Leave Messages Channel`,
								fields: [
									{
										name: "Before",
										value: oldChannel
											? channelMention(oldChannel)
											: `None`,
										inline: true,
									},
									{
										name: "After",
										value: args.input.toString(),
										inline: true,
									},
								],
							},
							message
						),
					],
				});
				break;

			case "join":
				const oldValue = this.client.settings.get(
					message.guild!.id,
					"joinMessage",
					""
				);

				if (!args.input || typeof args.input !== "string")
					return message.channel.send({
						embeds: [
							this.embed(
								{
									title: "Join Message",
									fields: [
										{
											name: "Current Unformatted",
											value: oldValue,
										},
										{
											name: "Current Formatted",
											value: replace(
												oldValue,
												message.author
											),
										},
									],
								},
								message
							),
						],
					});

				this.client.settings.set(
					message.guild!.id,
					"joinMessage",
					args.input
				);

				message.channel.send({
					embeds: [
						this.embed(
							{
								title: `${this.client.emoji.greenCheck} Changed Join Message`,
								fields: [
									{
										name: "Before",
										value: oldValue,
										inline: true,
									},
									{
										name: "After",
										value: args.input,
									},
									{
										name: "Before Formatted",
										value: replace(
											oldValue,
											message.author
										),
									},
									{
										name: "After Formatted",
										value: replace(
											args.input,
											message.author
										),
									},
								],
							},
							message
						),
					],
				});
				break;
			case "leave":
				const leaveValue = this.client.settings.get(
					message.guild!.id,
					"leaveMessage",
					""
				);

				if (!args.input || typeof args.input !== "string")
					return message.channel.send({
						embeds: [
							this.embed(
								{
									title: "Leave Message",
									fields: [
										{
											name: "Current Unformatted",
											value: leaveValue,
										},
										{
											name: "Current Formatted",
											value: replace(
												leaveValue,
												message.author
											),
										},
									],
								},
								message
							),
						],
					});

				this.client.settings.set(
					message.guild!.id,
					"leaveMessage",
					args.input
				);

				message.channel.send({
					embeds: [
						this.embed(
							{
								title: `${this.client.emoji.greenCheck} Changed Leave Message`,
								fields: [
									{
										name: "Before",
										value: leaveValue,
										inline: true,
									},
									{
										name: "After",
										value: args.input,
									},
									{
										name: "Before Formatted",
										value: replace(
											leaveValue,
											message.author
										),
									},
									{
										name: "After Formatted",
										value: replace(
											args.input,
											message.author
										),
									},
								],
							},
							message
						),
					],
				});
		}
	}
}
