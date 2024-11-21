import React, { useState, useEffect, useMemo } from 'react';
import { Box, IconButton, Text, Divider, Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSync } from 'react-icons/fa';
import { useTable, useSortBy } from 'react-table';

function PastRoutines() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  const navigate = useNavigate();

  const goHome = () => {
    navigate(`/`);
  };

  const fetchResults = async () => {
    try {
      const response = await fetch('http://localhost:3001/record/');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const fetchedData = await response.json();
      console.log(fetchedData);
      setData(fetchedData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setUpdate(!update);
  };

  useEffect(() => {
    fetchResults();
  }, [update]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const styles = { flex: '1 1 auto' };

  // Prepare table columns
  const columns = useMemo(() => [
    {
      Header: 'Date',
      accessor: 'date',
      style: styles,
      Cell: ({ value }) => formatDate(value), // Format date here
    },
    {
      Header: 'Exercises',
      accessor: 'exercise_name',   
      style: { flex: '0 1 35%' }, // Style for Column B
      Cell: ({ value }) => (
        <Text whiteSpace="normal" overflowWrap="break-word" width="100%">
          {value}
        </Text>
      ),
    },
    {
      Header: 'Sets',
      accessor: 'sets',
      style: styles, // Style for Column C
    },
    {
      Header: 'Weight',
      accessor: 'weight',
      style: styles, // Style for Column D
    },
    {
      Header: 'Reps',
      accessor: 'reps',
      style: styles, // Style for Column E
    },
  ], []);

  // Process data to handle row merging
  const processedData = useMemo(() => {
    const result = [];
    let currentRow = null;
    let dateCount = {};
  
      // Count occurrences of each date
      data.forEach(item => {
        dateCount[item.date] = (dateCount[item.date] || 0) + 1;
      });


    data.forEach((item, index) => {
      if (currentRow && item.date === currentRow.date) {
        result.push({ ...item, date: null, dateCount: dateCount[item.date] });
      } else {
        currentRow = item;
        result.push({ ...item, dateCount: dateCount[item.date] });
      }
    });
    return result;
  }, [data]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    { columns, data: processedData },
    useSortBy
  );

  return (
      <TableContainer maxWidth='100%' width='100%' overflowX='auto'>
        <Table {...getTableProps()} variant='simple'>
          <Thead>
            {headerGroups.map(headerGroup => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <Th
                    {...column.getHeaderProps()}
                    textAlign='left' style={column.style}
                    padding='0.75rem'
                    fontSize='0.8rem' fontWeight='bold' color='#080808'
                  >
                    {column.render('Header')}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell, index) => (
                    <Td
                      {...cell.getCellProps()}
                      style={{ wordWrap: 'break-word', fontSize:'0.9rem', padding:'0.75rem' }}
                    >
                      {cell.render('Cell')}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
  );
}

export default PastRoutines;
