const express = require('express')
const getopts = require('getopts')
const ws = require('./ws')

const config = getopts(process.argv.slice(2), {
  alias: {
    sink: 's'
  },
})

ws.start(config)
var app = express()

app.use(express.static('style'));
app.use(express.static('client-scripts'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})
app.get('/client.js', function (req, res) {
    res.sendFile(__dirname + '/client.js');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
