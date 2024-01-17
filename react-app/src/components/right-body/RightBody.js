import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import './RightBody.scss'

import DeleteIcon from '../../assets/icons/recycle-bin-line-icon.svg';

import RightTopBar from '../right-top-bar/RightTopBar';

const RightBody = (props) => {
  const { setShowAddClientModal, openClient, baseApiPath, setRefresh } = props;
  const clientNoteRefs = useRef([]); // https://stackoverflow.com/a/57810772

  // https://stackoverflow.com/a/36281449
  const getBase64 = (file, callback, ref) => {
    const reader = new FileReader();
    
    reader.readAsDataURL(file);
    
    reader.onload = function () {
      callback({
        err: false,
        data: reader.result,
        ref
      });
    };
    
    reader.onerror = function (error) {
      callback({
        err: true,
        msg: 'Failed to get image: ', error
      });
    };
  }
  
  const updateClientNote = (note_id, client_id, note_content) => {
    axios.post(
      `${baseApiPath}/update-client-note`,
      {
        note_id,
        client_id,
        note_content
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

  const imgDrop = (img) => {
    if (img?.data) {
      const imgNode = document.createElement("img");
      
      imgNode.setAttribute("src", img.data);

      document.getElementById('replace-img').replaceWith(imgNode);
    }
  }

  // https://stackoverflow.com/a/6691294
  const renderClientNotes = (clientNotes) => (
    clientNotes?.map((clientNote, index) => (
      <div key={index} className="RightBody__client-note">
        <p><b>Created:</b> {clientNote.created.split('T').join(' ')}</p>
        <div
          ref={el => clientNoteRefs.current[index] = el}
          className="RightBody__client-note-editable"
          contentEditable="true"
          onChange={(e) => updateClientNote(clientNote.id, clientNote.client_id, e.target.innerHTML)}
          onDrop={(e) => {
            e.stopPropagation();
            e.preventDefault();
            
            // add marker to be replaced by async image callback
            const range = document.getSelection().getRangeAt(0);
            const tmpNode = document.createElement("div");

            tmpNode.setAttribute("id", "replace-img");

            range.surroundContents(tmpNode);
    
            getBase64(e.dataTransfer.files[0], imgDrop, clientNoteRefs.current[index]);
          }}
        >{clientNote.note || "Type here"}</div>
        <button type="button" className="RightBody__client-note-delete" title="delete note">
          <img src={DeleteIcon} alt="delete icon"/>
        </button>
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
      <button type="button" className="RightBody__client-add-note" onClick={() => addClientNote(openClient.id)}>Add note</button>
      {renderClientNotes(openClient.clientNotes?.data)}
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