const express = require('express')
require('./ws')

var app = express()

app.use(express.static('style'));
app.use(express.static('client-scripts'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/joystick-test.html');
})
app.get('/client.js', function (req, res) {
    res.sendFile(__dirname + '/client.js');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
