const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');

const Captcha = require("@haileybot/captcha-generator")
for (const folder of commandFolders) {
const commandFiles = fs.readdirSync(`./commands/folder`).filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
const command = require(`./commands/folder/file`);
client.commands.set(command.name, command);
}
}
client.once('ready', () => {
console.log(`Logged in as ${client.user.username} ID: ${client.user.id}`);
});

client.on('message', (message) => {
if (!message.content.startsWith(config.prefix) || message.author.bot) return;

const argus = message.content.slice(config.prefix.length).trim().split(/ +/);
const commandName = argus.shift().toLowerCase();
const args = argus.join(` `);

const command =
client.commands.get(commandName) ||
client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

if (!command) return;

try {
command.execute(message, args, client);
} catch (error) {
console.error(error);
message.reply('there was an error trying to execute that command!');
}
});

client.on("guildMemberAdd", async (member) => {
    let captcha = new Captcha()

    let channel = member.guild.channels.cache.find((x) => x.name === "verify")

    if (!channel) {
        onsole.log(member.guild.name + "verification channel is invalid")
    }

    let vrole = member.guild.roles.cache.find((x) => x.name === "verified")
    
    if(!vrole){
        console.log(member.guild.name + "role is invalid")
    }

    const verifycode = await channel.send("Please Type The Given Code For Verification",
               new Discord.MessageAttachment(captcha.PNGStream, "captcha.png"))

    let collector = channel.createMessageCollector(
        m => m.author.id === member.id
    )
    collector.on("collect", m => {
        if(m.content.toUpperCase() === captcha.value) {
         m.delete()
          verifycode.delete()
          member.roles.remove(vrole)
          return member.send("**Verification Complete")
        } else if(m.content.toUpperCase() !== captcha.value) {
          member.send("**Invalid Code, retry by rejoining the server**")
          verifycode.delete()
          m.delete()
          
          setTimeout(function() {
                  member.kick()
          }, 30000)
            
        } else {
          verifycode.delete()
        }
    })

    })
client.login(config.token);