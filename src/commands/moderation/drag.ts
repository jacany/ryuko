import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import Error from "../../utils/error";

const args = [
	{
		id: "user",
		type: "memberMention",
	},
];

export default class DragCommand extends Command {
	protected args = args;

	constructor() {
		super("drag", {
			aliases: ["drag"],
			category: "Moderation",
			description: "Drag other members into your own channel",
			clientPermissions: ["MOVE_MEMBERS"],
			channel: "guild",
			args: args,
			modOnly: true,
		});
	}

	exec(message: Message, args: any): any {
		try {
			const victim = args.user;

			// Get the mentioned user
			const Channel = message.member!.voice.channel;
			// Check if the user is valid
			if (!victim)
				return message.channel.send(
					Error(
						message,
						this,
						"Invalid Argument",
						"You must provide a user to drag!"
					)
				);

			// Check if the channel is valid
			if (!Channel)
				return message.channel.send(
					Error(
						message,
						this,
						"Invalid Usage",
						"You must be inside a voice channel!"
					)
				);

			// Checks if the user is in a voice channel
			if (!victim.voice.channel)
				return message.channel.send(
					Error(
						message,
						this,
						"Invalid Usage",
						"The person you are trying to drag is not in a channel!"
					)
				);

			const oldChannel = args.user.voice.channel;
			victim.voice.setChannel(Channel);
			const logchannel = this.client.settings.get(
				message.guild!.id,
				"loggingChannel",
				"None"
			);
			if (logchannel === "None") return;
			return (
				// @ts-ignore
				this.client.channels.cache
					.get(logchannel)
					// @ts-ignore
					.send(
						new MessageEmbed({
							title: "Drag",
							description:
								"`" +
								victim.user.tag +
								"` `" +
								victim.user.id +
								"` was dragged",
							color: 16716032,
							timestamp: new Date(),
							author: {
								name: message.author.tag + " (" + message.author.id + ")",
								icon_url: message.author.avatarURL({ dynamic: true }) || "",
							},
							footer: {
								text: message.client.user?.tag,
								icon_url:
									message.client.user?.avatarURL({ dynamic: true }) || "",
							},
							fields: [
								{
									name: "From",
									value: "`" + oldChannel.name + "`",
									inline: true,
								},
								{
									name: "To",
									// @ts-ignore
									value: "`" + Channel.name + "`",
									inline: true,
								},
							],
						})
					)
			);
		} catch (error) {
			this.client.log.error(error);
			return message.channel.send(
				Error(message, this, "An error occurred", error.message)
			);
		}
	}
}