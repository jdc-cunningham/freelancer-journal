const { pool } = require('./database/db_connect');

require('dotenv').config({
  path: './.env'
});

const addClient = async (req, res) => {

}

module.exports = {
  addClient
}
