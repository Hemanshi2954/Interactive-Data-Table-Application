import React, { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { FixedSizeList as List } from 'react-window';
import axios from 'axios';
import Papa from 'papaparse';
import './App.css';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState(null);

  // Fetch data from Google Sheets
  useEffect(() => {
    const fetchData = async () => {
      const sheetUrl =
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vQb772OY28WdRJi-NJ4ck0VNgeSUfI8MK1SdfHT_IMjz8zrOn9i7Q-079L0EUq6NLaH1E4K3fmeCq8M/pub?output=csv';

      try {
        const response = await axios.get(sheetUrl);
        Papa.parse(response.data, {
          header: true,
          complete: (results) => setData(results.data),
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((query) => {
        setSearch(query);
      }, 300),
    []
  );

  const handleSearchInputChange = (event) => {
    const value = event.target.value;
    debouncedSearch(value); // Trigger the debounced search function
  };

  // Sort data based on a key
  const sortData = (key) => {
    const direction =
      sortConfig?.key === key && sortConfig.direction === 'ascending'
        ? 'descending'
        : 'ascending';
    setSortConfig({ key, direction });
  };

  // Filter and sort data based on search input and sort configuration
  const filteredAndSortedData = useMemo(() => {
    const lowercasedSearch = search.toLowerCase();
    const filtered = data.filter((item) =>
      item['Domain']?.toLowerCase().includes(lowercasedSearch)
    );

    if (sortConfig) {
      return filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, search, sortConfig]);

  const handleClearSearch = () => {
    setSearch('');
    debouncedSearch('');
  };

  return (
    <div className="data-table-wrapper">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Domain Name"
          value={search}
          onChange={handleSearchInputChange} // Immediate update of search
        />
        <button className="search-button" onClick={handleClearSearch}>
          Clear
        </button>
      </div>
      <div className="data-table-container">
        <table>
          <thead>
            <tr>
              {data[0] &&
                Object.keys(data[0]).map((key) => (
                  <th key={key} onClick={() => sortData(key)}>
                    {key}{' '}
                    {sortConfig?.key === key
                      ? sortConfig.direction === 'ascending'
                        ? '🔼'
                        : '🔽'
                      : ''}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
