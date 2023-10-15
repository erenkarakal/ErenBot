const { Events } = require('discord.js');
const fs = require('fs');
const process = require('node:process');
const generalChat = '1005137352383004777';
let lastMessage = 0;

module.exports = {
	name: Events.MessageCreate,
	once: false,
	execute(message) {
		if (message.author.id == '742312425948184656') {
			return;
		}
		const currentChannelId = message.channelId ?? message.channel.parent?.id;
		if (currentChannelId == generalChat) {
			const result = markovMe(message.content);
			if (++lastMessage >= 10 || message.mentions.users.findKey(user => user.id == '742312425948184656')) {
				lastMessage = 0;
				message.channel.send(result);
			}
		}
	},
};

const markovChain = require('../ai.json');

function markovMe(input) {
	const textArr = input.split(' ');
	for (let i = 0; i < textArr.length; i++) {
		const word = textArr[i].toLowerCase();
		if (!markovChain[word]) {
			markovChain[word] = [];
		}
		if (textArr[i + 1]) {
			markovChain[word].push(textArr[i + 1].toLowerCase());
		}
	}
	const words = Object.keys(markovChain);
	let word = words[Math.floor(Math.random() * words.length)];
	let result = '';
	const minLength = 1;
	const maxLength = 15;
	const messageLenght = Math.random() * (maxLength - minLength) + minLength;
	for (let i = 0; i < messageLenght; i++) {
		result += word + ' ';
		const newWord = markovChain[word][Math.floor(Math.random() * markovChain[word].length)];
		word = newWord;
		if (!word || !Object.prototype.hasOwnProperty.call(markovChain, word)) {
			word = words[Math.floor(Math.random() * words.length)];
		}
	}
	return result;
}

process.stdin.resume();

function exitHandler() {
	const stringJson = JSON.stringify(markovChain);
	console.log(stringJson);
	fs.writeFileSync('ai.json', stringJson);
	process.exit();
}

// register the exit handler
process.on('exit', exitHandler);

// handle Ctrl+C
process.on('SIGINT', () => {
	console.log('Received SIGINT');
	exitHandler();
});

// handle uncaught exceptions
process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err);
	exitHandler();
});