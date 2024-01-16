import React, { useState, useEffect } from 'react';

import './RightBody.scss'

import RightTopBar from '../right-top-bar/RightTopBar';

const RightBody = (props) => {
  const { setShowAddClientModal } = props;

  const [client, setClient] = useState(null);

  return (
    <div className="RightBody">
      <RightTopBar/>
      {!client && <h1>Select or add a freelance client</h1>}
      {!client && <button className="RightBody__add-client" type="button" onClick={() => setShowAddClientModal(true)}>Add</button>}
    </div>
  );
}

export default RightBody;