import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Input, Button, Pagination, Breadcrumb } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import TableActions from '../TableActions/TableActions';
import './CustomTable.scss';
import TerminalActions from '../Terminal/TerminalActions/TerminalActions';
import TransactionActions from '../Transactions/TransactionActions/TransactionActions';
import MerchantActions from '../Merchant/MerchantActions/MerchantActions';

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
  tableCustomFunction,
  onDeleteHandler,
  navbarSections,
  rotated,
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
    setDirection(direction === 'ascending' ? 'descending' : 'ascending');
    setColumn(clickedColumn);
    tableColumnSortHandler(clickedColumn, direction);
  };

  return (
    <div className={rotated ? 'tableDetailsRotated' : 'tableDetails'}>
      <div className="tableHeader">
        <div className="tableTitle">
          {tableTitle ? (
            <h3>{tableTitle}</h3>
          ) : (
            <Breadcrumb
              className="tableNavbar"
              icon="right angle"
              sections={navbarSections}
              size="large"
            />
          )}
        </div>
        <div className="tableHeaderWrapper">
          {tableAddItem && (
            <div>
              <Button as={Link} to={tableAddItem} color="black">
                Dodaj
              </Button>
            </div>
          )}
          {tableSearchHandler && (
            <div className="tableSearch">
              <Input
                icon={{ name: 'search', circular: true, link: true }}
                placeholder="Pretraži..."
                type="text"
                onChange={handleTextInputChange}
              />
            </div>
          )}
        </div>
      </div>
      <div className={rotated ? 'tableContentRotated' : 'tableContent'}>
        <Table sortable color="red" size="large">
          <Table.Header>
            <Table.Row>
              {tableHeader &&
                _.map(tableHeader, (value, key) => {
                  return key === 'actions' || !tableColumnSortHandler || key === 'groups' ? (
                    <Table.HeaderCell key={key}>{value}</Table.HeaderCell>
                  ) : (
                    <Table.HeaderCell
                      key={key}
                      sorted={column === key ? direction : null}
                      onClick={() => handleClickedColumn(key)}>
                      {value}
                    </Table.HeaderCell>
                  );
                })}
            </Table.Row>
          </Table.Header>
          {content && !!content.length && (
            <Table.Body>
              {content.map((item, key) => (
                <Table.Row key={key}>
                  {tableHeader &&
                    Object.keys(tableHeader).map((header, key) => {
                      return header === 'actions' && tableActions ? (
                        <Table.Cell key={key}>
                          {item.merchantId && (
                            <MerchantActions
                              actions={tableActions(item.merchantId)}
                              merchant={item}
                              merchantRerender={tableCustomFunction}
                            />
                          )}
                          {item.pointOfSaleId && (
                            <TableActions actions={tableActions(item.pointOfSaleId)} />
                          )}
                          {item.terminalId && (
                            <TerminalActions terminal={item} actionConfig={tableActions} />
                          )}
                          {item.userId && (
                            <TableActions
                              actions={tableActions(item.userId)}
                              onDeleteHandler={() => onDeleteHandler(item.userId)}
                            />
                          )}
                          {item.feeId && (
                            <TableActions
                              actions={tableActions(item.feeId)}
                              onDeleteHandler={() => onDeleteHandler(item.feeId)}
                            />
                          )}
                          {item.cityId && (
                            <TableActions
                              actions={tableActions()}
                              onDeleteHandler={() => onDeleteHandler(item.cityId)}
                            />
                          )}
                          {item.endToEndId && (
                            <TransactionActions
                              actions={tableActions(item.endToEndId)}
                              endToEndId={item.endToEndId}
                            />
                          )}
                        </Table.Cell>
                      ) : header === 'groups' ? (
                        <Table.Cell key={key}>
                          <div className="groupWrapper">
                            {item[header].map((groupName, key) => {
                              return <p key={key}>{`${groupName} `}</p>;
                            })}
                          </div>
                        </Table.Cell>
                      ) : header === 'status' ? (
                        <Table.Cell key={key} className={`tableStatus-${item[header]}`}>
                          {item[header]}
                        </Table.Cell>
                      ) : (
                        <Table.Cell key={key}>{item[header]}</Table.Cell>
                      );
                    })}
                </Table.Row>
              ))}
            </Table.Body>
          )}
        </Table>
      </div>
      {(!content || !content.length) && !rotated && (
        <div className="tableNoContent">Tabela ne sadrži podatke</div>
      )}
      {tableActivePage && (
        <div className="tablePageing">
          <Pagination
            siblingRange={null}
            activePage={tableActivePage}
            onPageChange={tableHandlePageChange}
            totalPages={tableTotalPages}
          />
        </div>
      )}
    </div>
  );
};

CustomTable.propTypes = {
  tableTitle: PropTypes.string,
  tableHeader: PropTypes.object,
  tableActions: PropTypes.func,
  tableCustomFunction: PropTypes.func,
  content: PropTypes.array,
  rotated: PropTypes.bool,
  tableSearchHandler: PropTypes.func,
  tableAddItem: PropTypes.string,
  tableActivePage: PropTypes.number,
  tableHandlePageChange: PropTypes.func,
  tableTotalPages: PropTypes.number,
  tableColumnSortHandler: PropTypes.func,
  onDeleteHandler: PropTypes.func,
  navbarSections: PropTypes.array,
};

export default CustomTable;
