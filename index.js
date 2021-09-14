require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const { sep } = require("path");

const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
    restTimeOffset: 50
});

["commands", "aliases"].forEach(x => client[x] = new Discord.Collection());

client.on('ready', async () => {
	const load = (dir = "./commands/") => {
		
		fs.readdirSync(dir).forEach(dirs => {
			const commands = fs.readdirSync(`${dir}${sep}${dirs}${sep}`).filter(files => files.endsWith(".js"));

			for (const file of commands) {
				const pull = require(`${dir}/${dirs}/${file}`);
				if (pull.help && typeof (pull.help.name) === "string" && typeof (pull.help.category) === "string") {
					if (client.commands.get(pull.help.name)) return console.warn(`❌ Two or more commands have the same name ${pull.help.name}.`);
					client.commands.set(pull.help.name, pull);
				}
				else {
					console.log(`❌ Error loading command in ${dir}${dirs}. you have a missing help.name or help.name is not a string. or you have a missing help.category or help.category is not a string`);
					continue;
				}
				if (pull.help.aliases && typeof (pull.help.aliases) === "object") {
					pull.help.aliases.forEach(alias => {
						if (client.aliases.get(alias)) return console.warn(`❌ Two commands or more commands have the same aliases ${alias}`);
						client.aliases.set(alias, pull.help.name);
					});
				}
			}
		});
	};
	load();

    client.user.setActivity("Souna's schedule", { type: "WATCHING" });
	client.user.setStatus("dnd");
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
    const prefix = "n!";
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    let command;
    
    if (message.author.bot || !message.guild) return;

    if (!message.content.toLowerCase().startsWith(prefix)) return;

    if (client.commands.has(cmd)) command = client.commands.get(cmd);
    else if (client.aliases.has(cmd)) command = client.commands.get(client.aliases.get(cmd));

    if (command) command.run(client, message, args);
});

client.login(process.env.BOT_TOKEN);