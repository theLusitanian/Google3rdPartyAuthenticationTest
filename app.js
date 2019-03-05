const http = require('http');
const fs = require('fs');
const hostname = '127.0.0.1';
const port = 3000;
const {parse} = require('querystring');
const mysql = require('mysql');

fs.readFile('./HomePage.html', function (err,html) {
	if (err) {
		throw err;
	}
	http.createServer(function(request, response) {
		if(request.method === 'POST') {
			postResponse(request, response);
		} else {
			homePageDisplay(html, response);
		}
	}).listen(3000);
});

function postResponse(request, response){
	var data = '';

        request.on('data', chunk => {
        	if(!(chunk === null || chunk === undefined))
        	data += chunk.toString();
        });

        request.on('end', () => {
        	var parsedData = parse(data);
                writeToDB(parsedData);
        });

        response.writeHeader(200, {"Content-Type":"text/plain"});
        response.write("Success");
        response.end();
}//end postResponse

function writeToDB(parsedData) {
	var connection = mysql.createConnection({
        	host : 'localhost',
        	database : '3rdPartyLogin',
        	user : 'root',
        	password : 'gundam',
        	insecureAuth : true
	});

	connection.connect(function(err) {
                if(err){
	                console.error('Error connecting: ' + err.stack);
                        return;
                }
                console.log('Connected as id '+ connection.threadId);
        });
	
	var insertStatement = "INSERT INTO Google_Credentials (id, name, profile_image, email) ";
	insertStatement += "VALUES (" + parsedData['id'] + ", '" + parsedData['name'] + "', '" + parsedData['picture_url'] + "', '" + parsedData['email'] + "');";

        connection.query(insertStatement, function (error, results, fields) {
        	if(error)
                	throw error;
               	console.log(results);
	});
	
	connection.end();
}//end writeToDB

function homePageDisplay(html, response) {
	response.writeHeader(200, {"Content-Type": "text/html"});
        response.write(html);
        response.end();
}//end homePageDisplay

