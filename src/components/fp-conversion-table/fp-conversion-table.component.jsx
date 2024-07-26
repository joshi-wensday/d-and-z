import React, { useState, useEffect } from 'react';
import { useTable, useFilters, useGlobalFilter, useSortBy } from 'react-table';
import { Input, Table } from '@/components/ui/table';

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

  const columns = React.useMemo(
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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Flame Point Conversion Table</h2>
      <Input
        value={filterInput}
        onChange={handleFilterChange}
        placeholder="Search table..."
        className="mb-4 p-2 border rounded"
      />
      <Table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default FPConversionTable;