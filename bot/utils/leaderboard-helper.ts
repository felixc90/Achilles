import { Embed } from "discord.js";

export class LeaderboardHelper {
	
	public static parsePageNumber(embed: Embed) {
		return parseInt(embed.footer?.text.split(' ')[2] ?? '0');
	}

	public static parseWeekDate(embed: Embed) {
		const description = embed.description ?? "";

		const datePart = description.replace(/Week starting\s+/i, '');
		// TODO: handle error checking
    const parsedDate = new Date(Date.parse(datePart));

		// TODO: make handling of dates consistent
		const utcDate = new Date(Date.UTC(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()));

		return utcDate;
	}
}

