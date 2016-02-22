'use strict';

var randomSentences = require('./random-sentences');
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.text({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
           
app.post('/go', function(req, res){
  var text = String(req.body);
  const order = parseInt(req.query.order) || 1;

  if (!text || text == '' || text.indexOf('.') == -1)
    return res.status(422).send('No sentence');

  var data = randomSentences.main(text, order);

  res.setHeader('Access-Control-Allow-Origin', '*');
  
  return res.status(200).send(data);
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Example app listening on port ' + port);
})

