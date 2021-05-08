import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class SkipCommand extends Command {
	constructor() {
		super("skip", {
			aliases: ["skip"],
			description: "Skips the currently playing song",
			category: "Music",
			channel: "guild",
		});
	}

	async exec(message: Message): Promise<any> {
		try {
			// @ts-ignore
			const serverQueue = message.client.queue.get(message.guild.id);
			if (serverQueue === undefined)
				return message.channel.send(
					this.client.error(
						message,
						this,
						"Invalid Usage",
						"There is no song currently playing"
					)
				);
			if (
				!message.member?.voice.channel ||
				message.member?.voice.channel !== serverQueue.voiceChannel
			)
				return message.channel.send(
					this.client.error(
						message,
						this,
						"Invalid Usage",
						"You have to be in the voice channel to skip the music!"
					)
				);
			serverQueue.connection.stopTrack();
		} catch (error) {
			this.client.log.error(error);
			return message.channel.send(
				this.client.error(message, this, "An error occurred", error.message)
			);
		}
	}
}
