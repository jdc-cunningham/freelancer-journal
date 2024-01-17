import React, { useState, useEffect } from 'react';

import './RightBody.scss'

import RightTopBar from '../right-top-bar/RightTopBar';

const RightBody = (props) => {
  const { setShowAddClientModal, openClient } = props;

  const renderClient = () => (
    <div className="RightBody__client">

    </div>
  );

  return (
    <div className="RightBody">
      <RightTopBar/>
      {!openClient && <h1>Select or add a freelance client</h1>}
      {!openClient && <button className="RightBody__add-client" type="button" onClick={() => setShowAddClientModal(true)}>Add</button>}
      {openClient && renderClient()}
    </div>
  );
}

export default RightBody;