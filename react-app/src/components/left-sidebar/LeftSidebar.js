import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './LeftSidebar.scss'

const LeftSidebar = (props) => {
  const { baseApiPath } = props;

  const [searchTerm, setSearchTerm] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const renderClientTabs = () => (
    searchResults.map((searchResult, index) => (
      <div className="LeftSidebar__search-result" title="open">
        <h2>{searchResult.name}</h2>
      </div>
    ))
  );

  useEffect(() => {
    if (searchTerm) {
      clearTimeout(searchTimeout);
      setSearchTimeout(setTimeout(() => {
        axios.post(
          `${baseApiPath}/search-clients`,
          { partialName: searchTerm }
        )
        .then((res) => {
          if (res.status === 200) {
            setSearchResults(res.data.clients);
          } else {
            alert('Failed to search clients: ' + res.data.msg);
          }
        })
        .catch((err) => {
          console.log(err);
          alert(`Failed to search clients:\n${err.response.data?.msg}`);
          console.error(err);
        });
      }, 250));
    }
  }, [searchTerm]);

  return (
    <div className="LeftSidebar">
      <input
        className="LeftSidebar__search-bar"
        type="text" placeholder="search name, topic"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && !searchResults.length && <h2 className="LeftSidebar__no-clients-found">No clients found</h2>}
      {searchTerm && searchResults.length > 0 && renderClientTabs()}
    </div>
  );
}

export default LeftSidebar;