var config = require('config');
var Discord = require('discord.js');
var SpotifyWebApi = require('spotify-web-api-node');

// Load config stuff into variables
var discordToken = config.get('Discord.token');
var botOwner = config.get('Discord.ownerID');
var spotifyClientId = config.get('Spotify.clientID');
var spotifyClientSecret = config.get('Spotify.clientSecret');

// Initialize a new Discord bot
var bot = new Discord.Client();
var spotifyApi = new SpotifyWebApi();

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

        if (command.startsWith('link')) {
            var params = command.substring('link'.length + 1).split(';');

            if (params.length == 2) {
                if (params[0] == 'spotify') {
                    if (params[1] == '') {
                        bot.sendMessage(message.channel, 'Missing parameter');                        
                    } else {
                        spotifyApi.searchTracks(params[1], {limit: 1, offset: 0}, function(err, data) {
                            if (err) {
                                console.error(err);
                            } else {
                                var track = data.body.tracks.items[0];
                                var artistNames = track.artists[0].name;
                                var albumName = track.album.name;
                                var trackName = track.name;
                                var trackLink = track.external_urls.spotify;
                                var response = "Top search result on Spotify for `" + params[1] + "`:\n**Artist: **" + artistNames + "\n**Album: **" + albumName + "\n**Track: **" + trackName + "\n**Link: **" + trackLink;
                                bot.sendMessage(message.channel, response);
                            }
                        });
                    }
                } else if (params[0] == '') {
                    bot.sendMessage(message.channel, 'Missing parameter');
                } else {
                    bot.sendMessage(message.channel, "Can't search in `" + params[0] + "`");
                }
            } else {
                bot.sendMessage(message.channel, 'Missing parameter');
            }
        }
    }
});

// Searches Spotify for tracks and links the top one
function SpotifySearchTrack(arg) {
    spotifyApi.searchTracks(arg, {limit: 1, offset: 0}, function(err, data) {
        if (err) {
            console.error(err);
        } else {
            return data.body.tracks.items[0].name;
        }
    });
}

// Log in the bot
bot.loginWithToken(discordToken);