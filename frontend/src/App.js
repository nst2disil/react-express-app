import React, { useState, useEffect } from 'react';
import './App.css';

const ITEMS_PER_PAGE = 18;
const HOME_PAGE = 1


function App() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(HOME_PAGE);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetch('/table')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const headers = getHeaders(data);
  const currentPageItems = getPageItemsID(data, currentPage, itemsPerPage);
  const visiblePageNumbers = getVisibblePageNumbers(data, itemsPerPage, currentPage);

  return (
    <div className="App">
      <p className="App-text">Данные из файла:</p>
      <div className="pagination">
        {visiblePageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`page-button ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}
      </div>
      {data.length > 0 ? (
        <div className="App-data">
          <table className="table">
            <thead>
              <tr>
                {headers.map(header => (<th key={header}>{header}</th>))}
              </tr>
            </thead>
            <tbody>
              {currentPageItems.map((row, id) => (
                <tr key={id}>
                  {headers.map(header => (<td key={header}>{row[header]}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (<p>No data!</p>)}
    </div>
  );
}

export default App;


function getHeaders(data) {
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  return headers;
}


function getPageItemsID(data, currentPage, itemsPerPage) {
  const LastItemID = currentPage * itemsPerPage;
  const FirstItemID = LastItemID - itemsPerPage;
  const currentPageItems = data.slice(FirstItemID, LastItemID);

  return currentPageItems;
}


function getVisibblePageNumbers(data, itemsPerPage, currentPage) {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const visiblePageNumbers = pageNumbers.slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2));

  return visiblePageNumbers;
}