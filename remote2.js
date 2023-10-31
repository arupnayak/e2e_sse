const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

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
  
    const interval = setInterval(() => {
        const message = `for ${clientId} `+'data: remote2 ' + new Date().toLocaleTimeString()
        console.log(message);
        response.write(message);
      }, 5000);
  
      setTimeout(function( ) { clearInterval( interval ); }, 30000);

  
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

const PORT = 3000;

let clients = [];
let facts = [];

app.listen(PORT, () => {
  console.log(`Facts Events service listening at http://localhost:${PORT}`)
})