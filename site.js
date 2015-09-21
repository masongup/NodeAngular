var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var pg = require('pg');
var connStr = 'postgres://localhost:5432/node-test';

pg.connect(connStr, function(err, client, done) {
  if(err) {
    return console.log('Error on intial load ' + err);
    done();
  }
});

app.use(express.static('public'));
app.use(express.static('bower_components'));
app.use(bodyParser.json());

function replyWithQueryJson(response, query, params) {
  pg.connect(connStr, function(err, client, done) {
    if(err) {
      console.log('Error on connection: ' + err);
      done();
      return;
    }
    var jsonQuery;
    if (params) {
      jsonQuery = 'SELECT row_to_json(q) AS data FROM (' + query + ') q;';
    }
    else {
      jsonQuery = 'SELECT array_to_json(array_agg(row_to_json(q))) AS data FROM ('
          + query + ') q;';
    }
    client.query(jsonQuery, params, function(err, result) {
      if(err) {
        console.log('Error on query: ' + err);
        done();
        return;
      }
      if (result.rowCount < 1) {
        response.status(404);
        response.send('That ID does not exist');
        done();
        return;
      }
      response.send(result.rows[0].data);
      done();
    });
  });
} 

app.get('/api/book', function(req, res) {
  replyWithQueryJson(res, 'SELECT id, title, author FROM Books ORDER BY id LIMIT 50');
});

app.get('/api/book/:num', function(req, res) {
  replyWithQueryJson(res, 'SELECT * FROM Books WHERE id = $1', [req.params.num]);
});

app.post('/api/book/', function(req, res) {
  pg.connect(connStr, function(err, client, done) {
    var insertQuery = 'INSERT INTO books (title, author, description) SELECT title, author, description FROM '
      + 'json_populate_record(null::books, $1) RETURNING id;';
    var updateQuery = 'UPDATE books SET title = j.t, author = j.a, description = j.d '
      + 'FROM (SELECT title AS t, author AS a, description AS d FROM json_populate_record(null::books, $1)) j '
      + 'WHERE id = $2;';
    var data = req.body;
    if (data.id) {
      client.query(updateQuery, [data, data.id], function(err, result) {
        res.status(204).end();
        done();
      });
    }
    else {
      client.query(insertQuery, [data], function(err, result) {
        res.send(result.rows[0]);
        done();
      });
    }
  });
});

app.get('*', function(req, res) {
  res.sendFile('/public/index.html', { root: __dirname });
});

var server = app.listen(4567, function() {
  console.log('Example app listening');
});
