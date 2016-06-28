var config = require('config');
var Discord = require('discord.js');

// Load config stuff into variables
var discordToken = config.get('Discord.token');
var botOwner = config.get('Discord.ownerID');

// Initialize a new Discord bot
var bot = new Discord.Client();

// Print a ready message once bot is logged in
bot.on('ready', function () {
    console.log(bot.user.username + " (" + bot.user.id + ") is ready to serve!");
});

// Runs everytime bot sees a new message
bot.on('message', function (message) {

    // This section only runs if the configured bot owner sends the message
    // Useful for owner-only commands 
    if (message.author.id == botOwner) {
        
        // An example of a command 
        if (message.content == "say hello") {
            bot.sendMessage(message.channel, "Hello");
        }
    }
})

// Log in the bot
bot.loginWithToken(discordToken);