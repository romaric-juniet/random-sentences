/*
 * Just a HTTP server receiving POST request on /go
 */
'use strict';

// Imports: Core logic, express and bodyParser
const randomSentences = require('./random-sentences');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.text({ limit: '5mb' }));
           
/*
 * /go endpoint
 * POST /go[?order=1]
 * The body of the request is the text used for generation. 
 * The body should have at least 2 sentences. Dot '.' is used to recognise begining of sentences.
 * Order is the order of n-grams to use. Optionnal. High is more reliable (more sense), lower is more fun
 */
app.post('/go', function(req, res){
  const text = String(req.body);
  const order = parseInt(req.query.order) || 1;

  if (!text || text == '' || text.indexOf('.') == -1)
    return res.status(422).send('At least 2 sentences needed to generate text');

  // Get some random text an return it
  const data = randomSentences.main(text, order);
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).send(data);
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Example app listening on port ' + port);
})

