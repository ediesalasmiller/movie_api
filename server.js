//first declaring variables
let http = require("http");
fs = require('fs'),
url = require('url');

//second, server creation with http module.
http.createServer((request, response) => {
    //a new addr variable, using request.url allows you to get the URL from the request (the first argument of the createServer function)
    let addr = request.url,
        //url.parse function used on new addr variable & results are being set to new variable, q. 
      q = url.parse(addr, true),
      //new variable, filePath declared, set to empty string. 
      //This will be where you store path of file; however, right now, it's just acting as an empty container
      //as you'll be piecing the file path together and placing it in your empty variable in the next if-else statement.
      filePath = '';
  
      
    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Added to log.');
      }
    });
  
    if (q.pathname.includes('documentation')) {
      filePath = (__dirname + '/documentation.html');
      //if there is no documentation in user typed url, then refer back to index regardless.
    } else {
      filePath = 'index.html';
    }
  
    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }
  
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(data);
      response.end();
  
    });
  
  }).listen(8080);
  console.log('My test server is running on Port 8080.');