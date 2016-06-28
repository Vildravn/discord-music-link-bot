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
    var mention = '<@' + bot.user.id + '>';

    // All commands should start with bot mention
    if (message.content.startsWith(mention)) {
        // Remove the mention from the message and convert the rest to lowercase
        var command = message.content.substring(mention.length + 1).toLowerCase();

        // This section only runs if the configured bot owner sends the message
        // Useful for owner-only commands
        if (message.author.id == botOwner) {
            // Example of a command
            if (command.startsWith('say')) {
                var params = command.substring('say'.length + 1).split(';');

                if (params[0] == '') {
                    bot.sendMessage(message.channel, 'Missing parameter');
                } else {
                    bot.sendMessage(message.channel, params[0]);
                }
            }
        }
    }
});

// Log in the bot
bot.loginWithToken(discordToken);