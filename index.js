'use strict';

// import dependencies and set up the server
const 
  express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request'),
  app = express().use(bodyParser.json()); // express http server created

// set server port and logs message on success 
app.listen(process.env.PORT || 1337, () => console.log('Webhook is listening on port 1337...'));


// Index route
app.get('/', (req, res) => {
  res.send('Hello world, I am a chat bot')
});

// create POST endpoint 
app.post('/webhook', (req, res) => {

  let body = req.body;

  // check that the  event is from a page subscription
  if (body.object === 'page') {
        
    // iterate over each entry in case of batch requests
    body.entry.forEach(entry => {
      // retrieves the message.  entry.message is an array, but will always contain one.
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // get the sender PSID
      if (webhook_event.sender) {
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);
      
        if (webhook_event.message) {
          handleMessage(sender_psid, webhook_event.message);
        } else if (webhook_event.postback) {
          handlePostback(sender_psid, webhook_event.postback);
        }
      }
    });

    //returns a 200 to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // if not from a page subscription, return a 404
    res.sendStatus(404);
  }

});

// GET endpoint for webhook
app.get('/webhook', (req, res) => {
 
  // verify token
  let VERIFY_TOKEN = "HALAL_OR_HARAM";

  // parse query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  if (mode && token) {

    // check the mode and token sent
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // respond with the challenge token from the request
      console.log('Webhook is verified.');
      res.status(200).send(challenge);

    } else {
      // respond with 403-forbidden if tokens/mode don't match
      res.sendStatus(403);  
    }
  } 
});

// handle message events
function handleMessage(sender_psid, received_message) {

  let responsoe;

  // Check if the message contains text
  if (received_message.text) {
    // create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}".`
    }
  }
  
  callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {}

function callSendAPI(sender_psid, response) {
  // construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  };

  const ACCESS_TOKEN = "EAAG4P251ImUBAKsVH67fUBqJv7o6AzcMDNryYTMB885ryCmXn2koOmX3gbsDPmGqWjN7Yr1ZC1lrTgZALLQbsXbbCA9xji7LV9SoVRb3WccXzB2poQmdY2lpoqq7LrZBlap3vQCvwuiFWojxUG8CXUfZAO8FmRFlXzb0taMqcgZDZD";
 
  //send the HTTP request to the messenger platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!');
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}
