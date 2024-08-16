import { ButtonInteraction } from 'discord.js';

export interface Button {
	customId: string;
	execute(intr: ButtonInteraction): Promise<any>;
}