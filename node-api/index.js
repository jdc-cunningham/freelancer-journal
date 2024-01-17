const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5135;

app.use(cors());

const { addClient, getClient, searchClients, deleteClient } = require('./methods');

app.use(
  bodyParser.json(),
  bodyParser.urlencoded({
    extended: true
  })
);

app.post('/add-client', addClient);
app.post('/get-client', getClient); // could use GET with /client-id/ pattern but eh...
app.post('/search-clients', searchClients);
app.post('/delete-client', deleteClient); // not using REST methods eg. DELETE

app.listen(port, () => {
  console.log(`App running... on port ${port}`);
});
