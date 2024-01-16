const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5135;

app.use(cors());

const { addClient } = require('./methods');

app.use(
  bodyParser.json(),
  bodyParser.urlencoded({
    extended: true
  })
);

app.post('/add-client', addClient);

app.listen(port, () => {
  console.log(`App running... on port ${port}`);
});
