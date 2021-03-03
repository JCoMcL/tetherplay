const express = require('express')
<<<<<<< HEAD
const getopts = require('getopts')
const ws = require('./ws')

const config = getopts(process.argv.slice(2), {
  alias: {
    sink: 's'
  },
})

ws.start(config)
=======
require('./ws')
require('./style/style.js')
var qrcode = require("qrcode-terminal")
var ip = require("ip")
>>>>>>> 3b07659 (add qrcode, rebased multi-user, change config for 4 gp buttons)
var app = express()

var port = 3000
app.use(express.static('style'));
app.use(express.static('client-scripts'));
app.use(express.static('img'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

<<<<<<< HEAD
app.get('/favicon.png', function (req, res) {
    res.sendFile(__dirname + '/img/tetherplay.png');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
=======
app.listen(port, function () {
  console.log('Example app listening on port 3000!');
<<<<<<< HEAD
  qrcode.generate(`https://${ip.address()}:${port}`);
>>>>>>> 3b07659 (add qrcode, rebased multi-user, change config for 4 gp buttons)
=======
  qrcode.generate(`http://${ip.address()}:${port}`);
>>>>>>> 31fa8a6 (change https to http for qr code)
})
