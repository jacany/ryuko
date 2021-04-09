import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

import Error from "../../utils/error";

const arg = [
	{
		id: "role",
		type: "role",
	},
];

export default class ModroleCommand extends Command {
	protected args = arg;

	constructor() {
		super("modrole", {
			aliases: ["modrole"],
			category: "Configuration",
			args: arg,
			description:
				"Changes the Mod Role, setting this is required if you want to use Moderation commands.",
			channel: "guild",
			userPermissions: ["ADMINISTRATOR"],
		});
	}

	async exec(message: Message, args: any): Promise<any> {
		const prefix = message.util?.parsed?.prefix;

		// The third param is the default.
		const currentRole = this.client.settings.get(
			message.guild!.id,
			"modRole",
			"None"
		);

		if (!args.role && currentRole !== "None") {
			return message.channel.send(
				new MessageEmbed({
					title: "Current Mod Role",
					color: 16716032,
					description: "`" + currentRole + "`",
					timestamp: new Date(),
					author: {
						name: message.author.tag,
						icon_url: message.author.avatarURL({ dynamic: true }) || "",
					},
					footer: {
						text: message.client.user?.tag,
						icon_url: message.client.user?.avatarURL({ dynamic: true }) || "",
					},
				})
			);
		} else if (!args.role && currentRole === "None") {
			return message.channel.send(
				Error(
					message,
					this,
					"Invalid Configuration",
					"There is no mod role set, use the '" +
						prefix +
						"modrole' command to set it."
				)
			);
		}

		await this.client.settings.set(message.guild!.id, "modRole", args.role.id);
		return message.channel.send(
			new MessageEmbed({
				title: ":white_check_mark: Changed Mod Role",
				color: 16716032,
				description:
					"`" + currentRole + "` :arrow_right: `" + args.role.id + "`",
				timestamp: new Date(),
				author: {
					name: message.author.tag,
					icon_url: message.author.avatarURL({ dynamic: true }) || "",
				},
				footer: {
					text: message.client.user?.tag,
					icon_url: message.client.user?.avatarURL({ dynamic: true }) || "",
				},
			})
		);
	}
}