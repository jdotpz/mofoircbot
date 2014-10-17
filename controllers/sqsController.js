"use strict";
var habitat = require('habitat');
var events = require('events');
var eventEmitter = new events.EventEmitter();

function callback(err, results) {
  if (err) console.log("Callback says theres an error" + err);
  console.log("Callback says results are", results);
}

// SOURCE THE ENV FILE
habitat.load('../.env');
var env = new habitat('sqs');
var awskey = env.get('accesskey');
var secretkey = env.get('secretkey');
console.log(env.all());
var SQS = require('aws-sqs');
var sqs = new SQS(awskey, secretkey);
var irc = require('./ircController'), callback;


function processMessage(err, results) {
  if (err) console.log("Error processing a message" + err.message);
  if (results !== null) {
    var curMsg = results[0];
    var curMsgBody = curMsg.Body;
    var msgId = curMsg.ReceiptHandle;
    console.log(msgId);
    console.log(results);
    irc.sendMessage('#mofo-deovps', curMsgBody, callback),console.log('Message sent to ' + ircopts_channels + ' and now will be deleted')
    sqs.deleteMessage(env.get('queuetowatch'), msgId, callback), console.log('Message deleted');
  } else {
    console.log('No messages to grab');
  }
}

// This will grab a message from the queue and send it to callback
// sqs.receiveMessage(env.get('queuetowatch'),processMessage);
sqs.receiveMessage(env.get('queuetowatch'), processMessage);


// exports.fetchFromQueue = fetchFromQueue;