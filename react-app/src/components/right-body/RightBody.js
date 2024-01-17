import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import './RightBody.scss'

import DeleteIcon from '../../assets/icons/recycle-bin-line-icon.svg';

import RightTopBar from '../right-top-bar/RightTopBar';

const RightBody = (props) => {
  const { setShowAddClientModal, openClient, baseApiPath, setRefresh } = props;
  const clientNoteRefs = useRef([]); // https://stackoverflow.com/a/57810772
  const [updateTimeout, setUpdateTimeout] = useState(null);
  const posRef = useRef(null);
  const elRef = useRef(null);

  // https://stackoverflow.com/a/36281449
  const getBase64 = (file, callback, ref, id, client_id) => {
    const reader = new FileReader();
    
    reader.readAsDataURL(file);
    
    reader.onload = function () {
      callback({
        err: false,
        data: reader.result,
        ref,
        id,
        client_id
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
      if (res.status === 200) {
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

      const parentEl = document.getElementById('replace-img').parentNode.parentNode;

      document.getElementById('replace-img').replaceWith(imgNode);

      updateClientNote(img.id, img.client_id, parentEl.innerHTML);
    }
  }

  // https://stackoverflow.com/a/46902361
  // this gives you number of characters from the left
  const getCaretPosition = (node) => {
    if (!Array.from(node.parentNode.classList).includes('RightBody__client-note-editable')) {
      return null; // limits depth, complexity of editable html content
    }

    const range = window.getSelection().getRangeAt(0);
    const preCaretRange = range.cloneRange();
    const tmp = document.createElement("div");
    
    let caretPosition;
    
    preCaretRange.selectNodeContents(node);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    tmp.appendChild(preCaretRange.cloneContents());
    caretPosition = tmp.innerHTML.length;
    
    const htmlBeforeCaret = node.parentNode.innerHTML.split(tmp.outerHTML)[0];

    const tmpDiv = document.createElement("div");

    tmpDiv.innerHTML = htmlBeforeCaret;

    return [caretPosition, tmpDiv.childNodes.length];
  }

  const omitKey = (e) => {
    const omit = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];

    return omit.includes(e.code);
  }

  // https://stackoverflow.com/a/6691294
  // the drop event provides the image via datatransfer, then caret is determined,
  // temporary node inserted, replaced by async image load base64 callback
  const renderClientNotes = (clientNotes) => (
    clientNotes?.map((clientNote, index) => (
      <div key={index} className="RightBody__client-note">
        <p><b>Created:</b> {clientNote.created.split('T').join(' ')}</p>
        <div
          ref={el => clientNoteRefs.current[index] = el}
          className="RightBody__client-note-editable"
          contentEditable="true"
          onKeyUp={(e) => {
            if (omitKey(e)) return;

            clearTimeout(updateTimeout);
            setUpdateTimeout(
              setTimeout(() => {
                elRef.current = e.target;
    
                updateClientNote(clientNote.id, clientNote.client_id, e.target.innerHTML)
              }, 250));
          }}
          onDrop={(e) => {
            e.stopPropagation();
            e.preventDefault();
            
            // add marker to be replaced by async image callback
            const range = document.getSelection().getRangeAt(0);
            const tmpNode = document.createElement("div");

            tmpNode.setAttribute("id", "replace-img");

            range.surroundContents(tmpNode);
    
            getBase64(e.dataTransfer.files[0], imgDrop, clientNoteRefs.current[index], clientNote.id, clientNote.client_id);
          }}
          dangerouslySetInnerHTML={{__html: (clientNote.note || <div>Type here</div>)}}
        ></div>
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

  // https://stackoverflow.com/a/6249440
  const setCaret = () => {
    var el = elRef.current;
    var range = document.createRange();
    var sel = window.getSelection();

    if (!el.childNodes[posRef.current[1]]) return; // this causes a fatal error if it doesn't exist
    
    range.setStart(el.childNodes[posRef.current[1]], 1); // in the end this does not use the x offset
    range.collapse(true)
    
    sel.removeAllRanges()
    sel.addRange(range)
  }

  useEffect(() => {
    document.addEventListener('click', (e) => {
      const caretPos = getCaretPosition(e.target);

      if (caretPos) {
        posRef.current = caretPos;
      }
    });
  }, []);

  useEffect(() => {
    if (posRef.current && elRef.current) {
      setCaret();
    }
  });

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