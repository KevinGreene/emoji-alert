require('dotenv').config();
var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var WebClient = require('@slack/client').WebClient;
var bot_token = process.env.SLACK_BOT_TOKEN;

var web = new WebClient(bot_token);
var rtm = new RtmClient(bot_token);

var triggers = ["space_invader"];
var reporting_channel = process.env.SLACK_REPORTING_CHANNEL;

rtm.on(RTM_EVENTS.REACTION_ADDED, function handleRtmMessage(message) {
  var reaction = message.reaction;
  if (triggers.includes(reaction)){
    web.channels.info(message.item.channel, function(err, channel_info){
      var channel_name = channel_info.channel.name;
      web.users.info(message.item_user, function(err, user_info){
        var offending_user = user_info.user.name;
        var message = "Report: user " + offending_user + " was reported with emoji " + reaction + " in channel " + channel_name;
        rtm.sendMessage(message, reporting_channel);
      });      
    });
  }
});

rtm.start();
