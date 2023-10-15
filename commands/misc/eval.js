const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('scary command')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('code')),
	async execute(interaction) {
		if (interaction.member.id != '587604022349791274') {
			return;
		}
		await (eval(interaction.options.getString('input')).toString() ?? 'no response');
	},
};