const http = require('http');
const fs = require('fs');
const hostname = '127.0.0.1';
const port = 3000;

var mysql = require('mysql');
var connection = mysql.createConnection({
        host : 'localhost',
        database : '3rdPartyLogin',
        user : 'root',
        password : 'gundam',
        insecureAuth : true
});

fs.readFile('./HomePage.html', function (err,html) {
	if (err) {
		throw err;
	}
	http.createServer(function(request, response) {
		if(request.method === 'POST') {
			connection.connect(function(err) {
				if(err){
					console.error('Error connecting: ' + err.stack);
					return;
				}
				console.log('Connected as id '+ connection.threadId);
			});

			connection.query('Select * FROM Google_Credentials', function (error, results, fields) {
				if(error)
					throw error;

				results.forEach(result => {
					console.log(result);
				});	
			});
			connection.end();

			response.writeHeader(200, {"Content-Type":"text/plain"});
			response.write("done");
			response.end();
		} else {
			response.writeHeader(200, {"Content-Type": "text/html"});
			response.write(html);
			response.end();
		}
	}).listen(3000);
});
