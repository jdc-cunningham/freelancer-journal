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

    return;
  }

  if (client?.exists) {
    res.status(400).send({
      err: true,
      msg: 'client exists'
    });

    return;
  }

  pool.query(
    `INSERT INTO clients SET id = ?, name = ?, topics = ?, rate = ?, rate_type = ?, details = ?, created = ?, last_updated = ?`,
    [null, name, topics, rate, rate_type, details, now, now],
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

const getClient = async (req, res) => {
  const { id } = req.body;

  pool.query(
    `SELECT * FROM clients WHERE id = ?`,
    [id],
    (err, qres) => {
      if (err) {
        console.error('failed to get client', err);

        res.status(400).send({
          err: true,
          msg: 'failed to get client'
        });
      } else {
        res.status(200).send({
          err: false,
          client: qres[0]
        });
      }
    }
  );
};

const searchClients = async (req, res) => {
  const { partialName } = req.body;
  const partialNameWildcard = '%' + partialName + '%';

  pool.query(
    `SELECT * FROM clients WHERE name LIKE ?`,
    [partialNameWildcard],
    (err, qres) => {
      if (err) {
        console.error('failed to search clients', err);

        res.status(400).send({
          err: true,
          msg: 'failed to search clients'
        });
      } else {
        res.status(200).send({
          err: false,
          clients: qres
        });
      }
    }
  );
};

const deleteClient = async (req, res) => {
  const { id } = req.body;

  // technically bad pattern since it should be assured both steps complete

  pool.query(
    `DELETE FROM client_notes WHERE client_id = ?`,
    [id],
    (err, qres) => {
      if (err) {
        console.error('failed to delete client_notes', err);

        res.status(400).send({
          err: true,
          msg: 'failed to delete client notes'
        });

        return;
      }
    }
  );

  pool.query(
    `DELETE FROM clients WHERE id = ?`,
    [id],
    (err, qres) => {
      if (err) {
        console.error('failed to delete client', err);

        res.status(400).send({
          err: true,
          msg: 'failed to delete client'
        });
      } else {
        res.status(200).send({
          err: false
        });
      }
    }
  );
};

const updateClient = async (req, res) => {};

const addClientNote = async (req, res) => {};

const updateClientNote = async (req, res) => {};

// used to populate app
const getLastOpenedClients = async (req, res) => {};

const addLastOpenedClient = async (req, res) => {};

const deleteLastOpenedClient = async (req, res) => {};

module.exports = {
  addClient,
  getClient,
  searchClients,
  deleteClient,
  updateClient,
  addClientNote,
  updateClientNote,
  getLastOpenedClients,
  addLastOpenedClient,
  deleteLastOpenedClient
}
