const { Events } = require('discord.js');
const bannedIds = [];
const erenChannel = '1009231187132301332';

module.exports = {
	name: Events.MessageCreate,
	once: false,
	execute(message) {
		const currentChannelId = message.channelId ?? message.channel.parent?.id;
		if (currentChannelId == erenChannel) {
			// start thread
			if (message.attachments.size > 0) {
				message.startThread({ 'name': 'THIS POST IS AWESOME' })
					.then(thread => { thread.send('i really love this post 51905/10'); });
			}

			// banned check
			if (bannedIds.includes(message.author.id)) {
				message.delete()
					.then(() => message.author.send('shut the fuck up'))
					.catch(console.error);
			}
		}
	},
};