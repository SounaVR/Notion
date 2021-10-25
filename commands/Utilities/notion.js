const { Client } = require("@notionhq/client");
const { MessageEmbed } = require("discord.js");
const { EmbedBuilder } = require('discord-embedbuilder');
const moment = require('moment');
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;
moment.locale('fr');

exports.run = async (client, message, args) => {
    if (!args[0]) {
        return message.reply({ content: "Calendriers disponibles : youtube" })
    }
    if (args[0].toLowerCase() == "youtube") {
        const getVideos = async () => {
            const payload = {
                path: `databases/${databaseId}/query`,
                method: 'POST'
            }

            const { results } = await notion.request(payload);
            const myEmbedArray = [];
            let tags = [];
            
            const videos = results.map(async page => {
                page.properties.Tags.multi_select.forEach(element => {
                    tags.push(` ${element.name}`)
                });
                myEmbedArray.push(
                new MessageEmbed()
                .setDescription(`Titre: ${page.properties.Name.title[0].text.content}\nDescription: ${page.properties.Description.rich_text[0].plain_text}`)
                .addField('Date :', moment(page.properties.Date.date.start).format('L'))
                .addField('Tags :', `${tags.splice(0, 4)}`)
                );
            });

            if (myEmbedArray.length == "0") return message.reply("Y'a plus de vidéos pour le moment :sadge:");

            const builder = new EmbedBuilder()
                .changeChannel(message.channel)
                .defaultReactions(['back', 'stop', 'next'])
                .setTime(60000);
                builder
                    .setEmbeds(myEmbedArray)
                    .setTitle('Vidéos YouTube')
                    .build(); // No need to send a message, building it will automatically do it.
            return videos;
        }
        (async () => {
            return await getVideos();
        })();
    }
    // if (args[0].toLowerCase() == "add" && args[1]) {
    //     addItem(args[1]);
    // } else {
    //     return message.reply({ content: "raté" });
    // }
    // async function addItem(text) {
    //     try {
    //         const response = await notion.pages.create({
    //             parent: { database_id: databaseId },
    //             properties: {
    //                 title: { 
    //                     title: [{
    //                     "text": {
    //                         "content": text
    //                     }
    //                     }]
    //                 }
    //             },
    //         })
    //         console.log(response);
    //         console.log("Success! Entry added.");
    //         message.channel.send("Success! Entry added.");
    //     } catch (error) {
    //         console.error(error.body);
    //     }
    // }
};

exports.help = {
    name: "notion",
    description: "Notion things",
    category: "Utilities"  
};