const { SlashCommandBuilder, WebhookClient } = require('discord.js');
const { webhookUrl } = require('../../config.json');
const webhookClient = new WebhookClient({ url: webhookUrl });

module.exports = {
	data: new SlashCommandBuilder()
		.setName('anonymous')
		.setDescription('Sends an anonymous message.')
		.addStringOption(option =>
			option.setName('message')
				.setDescription('Message to send.')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('impersonate')
				.setDescription('Impersonate a random person.')
				.setRequired(false)),
	async execute(interaction) {
		if (interaction.options.getBoolean('impersonate') == true) {
			interaction.guild.members.fetch().then(allMembers => {
				const member = allMembers.filter(user => !user.user.bot).random();
				const name = member.displayName;
				const avatar = member.displayAvatarURL();
				webhookClient.send({
					content: interaction.options.getString('message'),
					username: (name || 'Anonymous'),
					avatarURL: (avatar || 'https://media.discordapp.net/attachments/1136176558541918248/1158511031979606117/indir.png'),
					allowedMentions: { parse: [] },
				}).catch(console.error);
			}).catch(console.error);
		}
	},
};