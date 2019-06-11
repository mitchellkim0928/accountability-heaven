'use strict';

// import dependencies and set up the server
const 
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // express http server created

// set server port and logs message on success 
app.listen(process.env.PORT || 1337, () => console.log('Webhook is listening on port 1337...'));

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
