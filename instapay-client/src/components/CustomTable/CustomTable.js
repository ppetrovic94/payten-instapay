import React, { useRef, useState } from 'react';
import { Table, Input, Button, Pagination } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import TableActions from '../TableActions/TableActions';
import './CustomTable.scss';
import TerminalActions from '../Terminal/TerminalActions/TerminalActions';

const CustomTable = ({
  tableTitle,
  tableHeader,
  tableActions,
  content,
  tableSearchHandler,
  tableAddItem,
  tableActivePage,
  tableHandlePageChange,
  tableTotalPages,
  tableColumnSortHandler,
}) => {
  const intervalRef = useRef();
  const [direction, setDirection] = useState('ascending');
  const [column, setColumn] = useState(null);

  const handleTextInputChange = (e) => {
    const value = e.target.value;
    clearTimeout(intervalRef.current);
    intervalRef.current = setTimeout(() => tableSearchHandler(value), 350);
  };

  const handleClickedColumn = (clickedColumn) => {
    setDirection(direction == 'ascending' ? 'descending' : 'ascending');
    setColumn(clickedColumn);
    tableColumnSortHandler(clickedColumn, direction);
  };

  return (
    <div className="tableDetails">
      <div className="tableHeader">
        <div className="tableTitle">
          <h3>{tableTitle ? tableTitle : ''}</h3>
        </div>
        <div className="tableHeaderWrapper">
          {tableAddItem && (
            <div>
              <Button as={Link} to={tableAddItem} color="black">
                Dodaj
              </Button>
            </div>
          )}
          <div className="tableSearch">
            <Input
              icon={{ name: 'search', circular: true, link: true }}
              placeholder="Pretraži..."
              type="text"
              onChange={handleTextInputChange}
            />
          </div>
        </div>
      </div>
      <div className="tableContent">
        <Table sortable collapsing color="red" size="large">
          <Table.Header>
            <Table.Row>
              {tableHeader &&
                _.map(tableHeader, (value, key) => {
                  return key === 'actions' || !tableColumnSortHandler ? (
                    <Table.HeaderCell key={key}>{value}</Table.HeaderCell>
                  ) : (
                    <Table.HeaderCell
                      key={key}
                      sorted={column == key ? direction : null}
                      onClick={() => handleClickedColumn(key)}>
                      {value}
                    </Table.HeaderCell>
                  );
                })}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {content &&
              content.map((item, key) => (
                <Table.Row key={key}>
                  {tableHeader &&
                    Object.keys(tableHeader).map((header, key) => {
                      return header === 'actions' && tableActions ? (
                        <Table.Cell key={key}>
                          {item.merchantId && (
                            <TableActions actionKey={item.merchantId} actionConfig={tableActions} />
                          )}
                          {item.pointOfSaleId && (
                            <TableActions
                              actionKey={item.pointOfSaleId}
                              actionConfig={tableActions}
                            />
                          )}
                          {item.terminalId && (
                            <TerminalActions terminal={item} actionConfig={tableActions} />
                          )}
                          {item.userId && (
                            <TableActions actionKey={item.userId} actionConfig={tableActions} />
                          )}
                          {item.feeId && (
                            <TableActions actionKey={item.feeId} actionConfig={tableActions} />
                          )}
                        </Table.Cell>
                      ) : header == 'groups' ? (
                        <Table.Cell>
                          <div className="groupWrapper">
                            {item[header].map((groupName) => {
                              return <p>{`${groupName} `}</p>;
                            })}
                          </div>
                        </Table.Cell>
                      ) : (
                        <Table.Cell key={key}>{item[header]}</Table.Cell>
                      );
                    })}
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
      <div className="tablePageing">
        <Pagination
          siblingRange={null}
          activePage={tableActivePage}
          onPageChange={tableHandlePageChange}
          totalPages={tableTotalPages}
        />
      </div>
    </div>
  );
};

export default CustomTable;
