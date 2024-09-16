"use client";
import {
  Table,
  Td,
  Th,
  Tr,
  Thead,
  Tbody,
  Flex,
  Button,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";

export default function ReactTable({ tableColumns, tableData }) {
  const columns = useMemo(() => tableColumns, [tableColumns]);
  const data = useMemo(() => tableData, [tableData]);
  const [pageNo, setPageNo] = useState(0);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    nextPage,
    previousPage,
    pageCount,
    state: { pageIndex },
  } = useTable(
    {
      columns: columns,
      data: data,

      initialState: {
        pageIndex: 0,
      },
    },

    useSortBy,
    usePagination
  );
  useEffect(() => {
    console.log(tableColumns, tableData);
  }, [tableColumns, tableData]);
  return (
    <div className="w-75">
      <Table
        variant={"striped"}
        colorScheme="teal"
        {...getTableProps()}
        textAlign={"center"}
      >
        <Thead>
          {headerGroups.map((headerGroup, i) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={i}>
              <Th>Sl No.</Th>
              {headerGroup.headers.map((column) => (
                <>
                  <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </Th>
                </>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={i}>
                <Td>{i + 1 + pageIndex * 10}</Td>
                {row.cells.map((cell, ind) => {
                  return (
                    <>
                      <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                    </>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {pageCount > 1 && (
        <Flex justify={"space-between"} align={"center"} m={4}>
          <Flex gap={20}>
            <Button onClick={() => gotoPage(0)}>First Page</Button>
            <Button onClick={previousPage}>Previous Page</Button>
          </Flex>
          <Flex gap={5}>
            <Text>Go to Page</Text>
            <Input
              type="number"
              value={pageNo}
              onChange={(e) => {
                setPageNo(e.target.value);
              }}
            />
            <Button onClick={() => gotoPage(pageNo)}>Go</Button>
          </Flex>
          <Flex gap={20}>
            <Button onClick={nextPage}>Next Page</Button>
            <Button onClick={() => gotoPage(pageCount - 1)}>Last Page</Button>
          </Flex>
        </Flex>
      )}
    </div>
  );
}
