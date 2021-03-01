const express = require('express')
require('./ws')
require('./style/style.js')

var app = express()

app.use(express.static('style'));
app.use(express.static('client-scripts'));
app.use(express.static('icons'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
