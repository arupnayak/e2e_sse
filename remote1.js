const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { readChunk } = require('./util');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/status', (request, response) => response.json({clients: clients.length}));

function eventsHandler(request, response, next) {
    const clientId = request.body.clientId
    console.log(clientId)
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);

    fetch('https://laughing-space-xylophone-jrjxw5x4v6qf5v47-3000.app.github.dev/chat', {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json",
            "Connection": "keep-alive"
        },
        body: JSON.stringify({ clientId }),
    })
        .then(res => {
            // Get the readable stream from the response body
            const stream = res.body;
            // Get the reader from the stream
            const reader = stream.getReader();

            // Start reading the first chunk
            readChunk(reader, response);
        })
        .catch(error => {
            // Log the error
            console.error(error);
        });
  
    const interval = setInterval(() => {
        const message = `for ${clientId} `+'data: remote1 ' + new Date().toLocaleTimeString()
        console.log(message);
        response.write(message);
      }, 5000);
  
    
  
    // const clientId = Date.now();
  
    // const newClient = {
    //   id: clientId,
    //   response
    // };
  
    // clients.push(newClient);
  
    request.on('close', () => {
        const clientId = request.body.clientId
      console.log(`${clientId} Connection closed`);
    //   clients = clients.filter(client => client.id !== clientId);
    });
  }
  
  app.post('/chat', eventsHandler);

const PORT = 5000;

let clients = [];
let facts = [];

app.listen(PORT, () => {
  console.log(`Facts Events service listening at http://localhost:${PORT}`)
})