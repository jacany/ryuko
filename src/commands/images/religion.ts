import Command from "../../struct/Command";
import { Message, MessageEmbed, MessageAttachment } from "discord.js";
import axios, { AxiosResponse } from "axios";

export default class ReligionCommand extends Command {
	constructor() {
		super("religion", {
			aliases: ["religion"],
			description:
				"Generates a text conversation that involved someone showing their 'religion' to another person, the religion being represented by an image. Supports image attachments.",
			category: "Images",
		});
	}

	async _getImage(image: string): Promise<AxiosResponse> {
		return axios.get(this.client.config.imgApiUrl + "/religion", {
			params: {
				avatar: image,
			},
			responseType: "stream",
		});
	}

	async exec(message: Message) {
		const loadMessage = await message.channel.send(
			this.client.config.emojis.loading + "*Please wait..*"
		);

		const messageAttachment = message.attachments.first();

		const image = await this._getImage(
			messageAttachment
				? messageAttachment.url
				: message.author.avatarURL({
						dynamic: true,
						format: "png",
				  }) || ""
		);

		const attachment = new MessageAttachment(image.data, "image.png");

		loadMessage.delete();

		return message.channel.send({
			embed: new MessageEmbed({
				title: "Religion",
				color: message.guild?.me?.displayHexColor,
				image: {
					url: "attachment://image.png",
				},
				timestamp: new Date(),
				footer: {
					text: message.author.tag,
					icon_url: message.author.displayAvatarURL({
						dynamic: true,
					}),
				},
			}),
			files: [attachment],
		});
	}
}
