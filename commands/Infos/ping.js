exports.run = async (client, message, args) => {
    const m = await message.channel.send("Ping ?");
    m.edit(`Pong!\nLatence ► ${m.createdTimestamp - message.createdTimestamp} ms. \nAPI Discord ► ${Math.round(client.ws.ping)} ms`);
};

exports.help = {
    name: "ping",
    description: "Affiche la latence du bot",
    category: "Infos",
    aliases: ["pong"]    
};