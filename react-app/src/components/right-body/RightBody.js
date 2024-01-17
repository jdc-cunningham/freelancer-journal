import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './RightBody.scss'

import RightTopBar from '../right-top-bar/RightTopBar';

const RightBody = (props) => {
  const { setShowAddClientModal, openClient, baseApiPath, setRefresh } = props;

    // https://stackoverflow.com/a/36281449
    const getBase64 = (file, callback) => {
      const reader = new FileReader();
      
      reader.readAsDataURL(file);
      
      reader.onload = function () {
        callback({
          err: false,
          data: reader.result
        });
      };
      
      reader.onerror = function (error) {
        callback({
          err: true,
          msg: 'Failed to get image: ', error
        });
      };
    }

  const renderClientNotes = (clientNotes) => (
    clientNotes?.map((clientMap, index) => (
      <div key={index} className="RightBody__client-note" onDrop={(e) => {
        e.stopPropagation();
        e.preventDefault();

        console.log(getBase64(e.dataTransfer.files[0]));
      }}>

      </div>
    ))
  );

  const addClientNote = (client_id) => {
    axios.post(
      `${baseApiPath}/add-client-note`,
      {
        client_id
      }
    )
    .then((res) => {
      console.log(res);
      if (res.status === 201) {
        setRefresh(true);
      } else {
        alert('Failed to add client note: ' + res.data.msg);
      }
    })
    .catch((err) => {
      alert(`Failed to add client note:\n${err.response.data?.msg}`);
      console.error(err);
    });
  }

  const renderClient = () => (
    <div className="RightBody__client">
      <h1>{openClient.name}</h1>
      <p>{openClient.details}</p>
      {renderClientNotes(openClient.notes)}
      <button type="button" className="RightBody__client-add-note" onClick={() => addClientNote(openClient.id)}>Add note</button>
    </div>
  );

  return (
    <div className="RightBody">
      <RightTopBar/>
      {!openClient && <h1>Select or add a freelance client</h1>}
      {!openClient && <button className="RightBody__add-client" type="button" onClick={() => setShowAddClientModal(true)}>Add</button>}
      {openClient && renderClient()}
      {openClient && <button className="RightBody__client-view-add-client" type="button" onClick={() => setShowAddClientModal(true)}>Add client</button>}
    </div>
  );
}

export default RightBody;