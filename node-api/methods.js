const { pool } = require('./database/db_connect');
const { formatTimeStr, getDateTime } = require('./utils');

require('dotenv').config({
  path: './.env'
});

const addClient = async (req, res) => (
  new Promise ((resolve, reject) => {
    const { name, topics, rate, rate_type, details } = req.body;
    const now = formatTimeStr(getDateTime());

    pool.query(
      `INSERT INTO clients SET id = ?, name = ?, topics = ?, rate = ?, rate_type = ?, details = ?, created = ?`,
      [null, name, topics, rate, rate_type, details, now],
      (err, qres) => {
        if (err) {
          console.error('failed to insert client', err);
          return {
            err: true,
          };
        } else {
          return {
            err: false,
          };
        }
      }
    );
  })
);

const getClient = async (req, res) => (
  new Promise ((resolve, reject) => {

  })
);

const searchClients = async (req, res) => (
  new Promise ((resolve, reject) => {

  })
);

const deleteClient = async (req, res) => (
  new Promise ((resolve, reject) => {

  })
);

const updateClient = async (req, res) => (
  new Promise ((resolve, reject) => {

  })
);

const addClientNote = async (req, res) => (
  new Promise ((resolve, reject) => {

  })
);

const updateClientNote = async (req, res) => (
  new Promise ((resolve, reject) => {

  })
);

module.exports = {
  addClient,
  getClient,
  searchClients,
  deleteClient,
  updateClient,
  addClientNote
}
