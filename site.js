var express = require('express');
var app = express();

app.use(express.static('public'));
app.use(express.static('bower_components'));
app.use('/uib', express.static('bower_components/angular-ui-bootstrap'));

app.get('*', function(req, res) {
  res.sendFile('/public/index.html', { root: __dirname });
});

var server = app.listen(4567, function() {
  console.log('Example app listening');
});
