irc = require('irc');
habitat = require('habitat');

// SOURCE THE ENV FILE
habitat.load('./.env');
var env = new habitat('irc');

// SET VARS FOR USE IN IRC
var ircopts_host = env.get('host');
var ircopts_channels = env.get('channels');
var ircopts_port = env.get('port');
var ircopts_ssl = env.get('ssl');
var ircopts_autorejoin = env.get('autorejoin_enabled');
var ircopts_username = env.get('username');
var all_opts = env.all();
console.log(env.all());

function callback(err, results) {
  if (err) return err.message;
  console.log("Error on the app" + err.message);
}

// CONNECT UP
var client = new irc.Client(ircopts_host, ircopts_username, {
  channels: [ircopts_channels],
  port: ircopts_port,
  secure: ircopts_ssl,
  autoRejoin: ircopts_autorejoin
});

// WATCH FOR IRC ERRORS AND DON'T BOMB
client.addListener('error', function(message) {
  console.log('error: ', message);
});

// RETRY 5 TIMES IF NEESSARY
client.connect(5, function(err, callback) {
  client.join(ircopts_channels);
  client.say(ircopts_channels, "I am functional again.  Skynet otw.");
  console.log('Connected to irc with', all_opts);
});

client.addListener('message#mofo-devops', function (from, message) {
    console.log(from + ' => #mofo-devops: ' + message);
});

var sendMessage = function(ircopts_channels, msgtosend, callback) {
  var ircopts_channels = env.get('channels');
  client.say(ircopts_channels, msgtosend);
}

exports.sendMessage = sendMessage;