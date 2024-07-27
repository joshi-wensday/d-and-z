import React, { useState, useEffect, useMemo } from 'react';
import { useTable, useFilters, useGlobalFilter, useSortBy } from 'react-table';

const FPConversionTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // In a real app, this would fetch data from an API
    setData([
      { category: 'Life', metric: 'Woman approached', conversionRule: '1 per (+2FP), 2 per (+1FP)', example: '1/per(+2FP),2/per (+1FP) = total of +4FP' },
      { category: 'Life', metric: 'Woman NOT approached', conversionRule: '-1 per', example: '3 = -3FP' },
      { category: 'Dreams', metric: 'Dream work sessions', conversionRule: '1 per 25 minutes (1 triangle)', example: '8 triangles = 8FP' },
      // ... add more data here
    ]);
  }, []);

  const columns = useMemo(
    () => [
      { Header: 'Category', accessor: 'category' },
      { Header: 'Metric', accessor: 'metric' },
      { Header: 'Conversion Rule', accessor: 'conversionRule' },
      { Header: 'Example', accessor: 'example' },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable({ columns, data }, useFilters, useGlobalFilter, useSortBy);

  const [filterInput, setFilterInput] = useState('');

  const handleFilterChange = e => {
    const value = e.target.value || undefined;
    setGlobalFilter(value);
    setFilterInput(value);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Flame Point Conversion Table</h2>
      <input
        value={filterInput}
        onChange={handleFilterChange}
        placeholder="Search table..."
        style={{ marginBottom: '1rem', padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '100%' }}
      />
      <table {...getTableProps()} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th 
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{ 
                    borderBottom: 'solid 3px #ddd',
                    background: '#f0f0f0',
                    color: 'black',
                    fontWeight: 'bold',
                    padding: '0.5rem',
                    textAlign: 'left'
                  }}
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td 
                    {...cell.getCellProps()}
                    style={{
                      padding: '0.5rem',
                      border: 'solid 1px #ddd'
                    }}
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FPConversionTable;