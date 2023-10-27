const http = require('http');
const { readChunk } = require('./util');

http.createServer((req, res) => {
    fetch('https://laughing-space-xylophone-jrjxw5x4v6qf5v47-5000.app.github.dev/chat', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json",
            "Connection": "keep-alive"
        },
        body: JSON.stringify({ clientId: 456 }),
    })
        .then(response => {
            // Get the readable stream from the response body
            const stream = response.body;
            // Get the reader from the stream
            const reader = stream.getReader();

            // Start reading the first chunk
            readChunk(reader, null);
        })
        .catch(error => {
            // Log the error
            console.error(error);
        });

}).listen(7000);
