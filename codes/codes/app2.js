//app.js

const http = require('http')
const port = 4001
const hostname = '192.168.1.104'

// Create a server object:
const server = http.createServer(function (req, res) {

    // Write a response to the client
    res.write('Screen 2')

    // End the response 
    res.end()
})

// Set up our server so it will listen on the port
server.listen(port, hostname,function (error) {

    // Checking any error occur while listening on port
    if (error) {
        console.log('Something went wrong', error);
    }
    // Else sent message of listening
    else {
        console.log('Server is listening on port' + port);
    }
})