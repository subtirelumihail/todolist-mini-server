var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var list = [];
var id = 1;

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: false
}));

app.get('/', function(req, response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.write('Welcome to the API World');
    response.end();
});

app.get('/all', function(req, response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', 'application/json');

    var l = {};

    Object.keys(list).forEach(function(key) {
        l[key] = list[key];

    });
    response.write(JSON.stringify(l));
    response.end();
});

//Get an html response
app.post('/html', function(req, response) {
    var text = req.body.text || 'No text sent';
    var textSize = req.body.text ? text.length : 0;

    response.header('Access-Control-Allow-Origin', '*');

    response.write('<h1>Datele trimise de tine sunt: '+text+'</h1><p>Numarul caracterelor: '+textSize+'</p>');
    response.end();

});

//Save a list item
app.post('/api/:user', function(req, response) {
    list[req.params.user] = list[req.params.user] || [];

    var text = req.body.text || 'untitled';
    var checked = req.body.checked || false;

    response.setHeader('Content-Type', 'application/json');
    response.header('Access-Control-Allow-Origin', '*');

    var todo = {
        id: id,
        text: text,
        checked: checked
    };

    list[req.params.user].push(todo);

    response.end(JSON.stringify(todo));

    id++;
});


//Get all the items in the list
app.get('/api/:user', function(req, response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', 'application/json');
    list[req.params.user] = list[req.params.user] || [];

    if (list[req.params.user].length) {
        response.end(JSON.stringify(list[req.params.user]));
    } else {
        response.end('[]');
    }
});


//Get list item by id
app.get('/api/:user/:id', function(req, response) {
    response.header('Access-Control-Allow-Origin', '*');
    list[req.params.user] = list[req.params.user] || '';

    //Lookup the item in the list
    var lookup = {};
    for (var i = 0, len = list[req.params.user].length; i < len; i++) {
        lookup[list[req.params.user][i].id] = list[req.params.user][i];
    }

    if (lookup[req.params.id]) {
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(lookup[req.params.id]));
    } else {
        response.status(404);
        response.end();
    }
});


app.post('/api/:user/:id', function(req, response) {
    response.header('Access-Control-Allow-Origin', '*');

    if (typeof list[req.params.user] === 'undefined') {
        response.status(404);
        response.end();
        return;
    }

    var text = req.body.text || 'untitled';
    var checked = req.body.checked || false;

    //Lookup the item in the list
    var lookup = {};
    for (var i = 0, len = list[req.params.user].length; i < len; i++) {
        lookup[list[req.params.user][i].id] = list[req.params.user][i];
    }

    lookup[req.params.id].checked = checked;
    lookup[req.params.id].text = text;

    response.status(204);
    response.end();
});


app.delete('/api/:user/:id', function(req, response) {
    response.header('Access-Control-Allow-Origin', '*');

    if (typeof list[req.params.user] === 'undefined') {
        response.status(404);
        response.end();
        return;
    }

    list[req.params.user] = list[req.params.user].filter(function(el) {
        return el.id != req.params.id;
    });


    response.status(204);
    response.end();
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});
