const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { readChunk } = require('./util');
require('dotenv').config()

const {AZURE_OPEN_API_URL, AZURE_OPEN_API_KEY} = process.env

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/status', (request, response) => response.json({clients: clients.length}));

function eventsHandler(request, response, next) {
    // const clientId = request.body.clientId
    // console.log(clientId)
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);

    fetch(AZURE_OPEN_API_URL, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json",
            "Connection": "keep-alive",
            "api-key": AZURE_OPEN_API_KEY
        },
        body: JSON.stringify(request.body),
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

  
    request.on('close', () => {
        // const clientId = request.body.clientId
      // console.log(`${clientId} Connection closed`);
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