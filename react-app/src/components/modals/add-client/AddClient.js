import React, { useState, useEffect } from 'react';

import './AddClient.scss'

import CloseIcon from '../../../assets/icons/close-line-icon.svg';


const AddClient = (props) => {
  const [clientInfo, setClientInfo] = useState(null);

  return (
    <div className="AddClient">
      <div className="AddClient__form">
        <h1>Client Info</h1>
        <input type="text" placeholder="name"/>
        <input type="text" placeholder="topics"/>
        <span>
          <input type="number" placeholder="rate"/>
          <select>
            <option disabled selected>rate type</option>
            <option>hourly</option>
            <option>project</option>
          </select>
        </span>
        <textarea placeholder="details"/>
        <button type="button" className="AddClient__add">Add</button>
        <button type="button" className="AddClient__form-close">
          <img src={CloseIcon} title="close modal" alt="close icon"/>
        </button>
      </div>
    </div>
  );
}

export default AddClient;