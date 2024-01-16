const { pool } = require('./database/db_connect');
const { formatTimeStr, getDateTime } = require('./utils');

require('dotenv').config({
  path: './.env'
});

const _clientExists = async (clientName) => (
  new Promise ((resolve, reject) => {
    pool.query(
      `SELECT id FROM clients WHERE name = ?`,
      [clientName],
      (err, qres) => {
        if (err) {
          reject(new Error("failed to search client"));
        } else {
          resolve({
            err: false,
            exists: qres.length ? true : false
          });
        }
      }
    );
  })
);

const addClient = async (req, res) => {
  const { name, topics, rate, rate_type, details } = req.body;
  const now = formatTimeStr(getDateTime());

  let client = null;
  let clientSearchErr = false;

  try {
    client = await _clientExists(name);
  } catch (e) {
    console.error(e);
    clientSearchErr = true;
  }

  if (clientSearchErr) {
    res.status(400).send({
      err: true,
      msg: 'failed to check if client exists'
    });
  }

  if (client?.exists) {
    res.status(400).send({
      err: true,
      msg: 'client exists'
    });
  }

  pool.query(
    `INSERT INTO clients SET id = ?, name = ?, topics = ?, rate = ?, rate_type = ?, details = ?, created = ?`,
    [null, name, topics, rate, rate_type, details, now],
    (err, qres) => {
      if (err) {
        console.error('failed to insert client', err);
        res.status(400).send({
          err: true,
          msg: 'failed to add client'
        });
      } else {
        res.status(201).send({
          err: false,
        });
      }
    }
  );
};

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
