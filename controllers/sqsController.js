"use strict";
var habitat = require('habitat');

// SOURCE THE ENV FILE
habitat.load('./.env');
var env = new habitat('sqs');
var awskey = env.get('accesskey');
var secretkey = env.get('secretkey');
console.log(env.all());
var SQS = require('aws-sqs');
var sqs = new SQS(awskey, secretkey);
var irc = require('./controllers/ircController');

function callback(err, results) {
  if (err) console.log("Error on the app" + err.message);
  if (results !== null) {
    var ourMsg = results.Body;
    irc.sendMessage('#mofo-deovps', ourMsg);
    console.log(ourMsg);
  } else {
    console.log('No messages to grab');
  }
}

var fetchFromQueue = sqs.receiveMessage(env.get('queuetowatch'),callback);

exports.fetchFromQueue = fetchFromQueue;