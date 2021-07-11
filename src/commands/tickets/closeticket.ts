import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class TicketCommand extends Command {
	constructor() {
		super("closeticket", {
			aliases: ["close", "closeticket"],
			description: "Closes the current ticket",
			category: "Tickets",
			clientPermissions: ["MANAGE_CHANNELS"],
		});
	}

	async exec(message: Message): Promise<any> {
		const ticketResult = await this.client.db.findTicket(
			message.guild!.id,
			message.channel.id
		);

		if (!ticketResult)
			return message.channel.send(
				this.client.error(
					message,
					this,
					"Invalid Channel",
					"This is not a ticket channel!"
				)
			);

		const ticketRole = this.client.settings.get(
			message.guild!.id,
			"ticketRole",
			null
		);

		if (
			(ticketRole &&
				message.member!.roles.cache.find(
					(role) => role.id == ticketRole
				)) ||
			message.member!.permissions.has("MANAGE_CHANNELS") ||
			message.author.id == ticketResult?.memberId
		) {
			message.channel.delete(
				`Closed by ${message.author.username}#${
					message.author.discriminator
				} at ${new Date().toString()}`
			);
			this.client.db.deleteTicket(
				message.guild!.id,
				message.member!.id,
				message.channel.id
			);
		}
	}
}
