
var express = require('express')
var ws = require('./ws')

var app = express()

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/test.html');
})
app.get('/style.css', function (req, res) {
    res.sendFile(__dirname + '/style.css');
})
app.get('/client.js', function (req, res) {
    res.sendFile(__dirname + '/client.js');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
