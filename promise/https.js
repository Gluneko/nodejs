var https = require('https');
var fs = require('fs');

var options = {
    key: fs.readFileSync('ssh_key.pem'),
    cert: fs.readFileSync('ssh_cert.pem'),
}

http.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end('Hello Imooc');
})
    .listen(8090);