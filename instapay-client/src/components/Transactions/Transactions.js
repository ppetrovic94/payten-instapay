import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../utils/API';
import { Button, Breadcrumb, Form } from 'semantic-ui-react';
import './Transactions.scss';
import CustomTable from '../CustomTable/CustomTable';
import {
  transactionsTableHeader,
  terminalActionConfig,
  formatTransactionsInstructedAmounts,
} from './utils/transactionsTable';
import CustomLoader from '../CustomLoader/CustomLoader';

const Transactions = () => {
  const [date, setDate] = useState({ dateFrom: '', dateTo: '' });
  const [time, setTime] = useState({ timeFrom: '', timeTo: '' });
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [transactions, setTransactions] = useState(null);
  const [acquirerTid, setAcquirerTid] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sections, setSections] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    localStorage.setItem('terminalId', id);
    const fetchNavbarData = async () => {
      const merchantId = localStorage.getItem('merchantId');
      const posId = localStorage.getItem('pointOfSaleId');

      try {
        const posName = await axios.get(`/user/pos/${posId}/name`);
        const merchantName = await axios.get(`/user/merchants/${merchantId}/name`);
        const terminalName = await axios.get(`/user/terminals/${id}/acquirerTid`);
        setAcquirerTid(terminalName.data);
        setSections([
          {
            key: 'merchantName',
            content: merchantName.data,
            href: `/ips/merchant/${merchantId}/pos`,
          },
          {
            key: 'pointOfSaleName',
            content: posName.data,
            href: `/ips/pos/${posId}/terminals`,
          },
          {
            key: 'terminalName',
            content: terminalName.data,
          },
          { key: 'transactions', content: 'Transakcije' },
        ]);
      } catch (err) {
        console.error(err.response);
      }
    };

    fetchNavbarData();
  }, []);

  const onChangeDate = (e) => {
    if (e.target.name === 'dateFrom') {
      if (date.dateTo && e.target.value) setDisabled(false);
    } else {
      if (date.dateFrom && e.target.value) setDisabled(false);
    }

    setDate({ ...date, [e.target.name]: e.target.value });
  };

  const onGetTransactions = async () => {
    setLoading(true);
    const dateAndTime = {
      from: time.timeFrom ? date.dateFrom + ' ' + time.timeFrom : date.dateFrom,
      to: time.timeTo ? date.dateFrom + ' ' + time.timeTo : date.dateTo,
    };
    try {
      const response = await axios.get(
        `/user/terminals/transactions?terminalId=${acquirerTid}&dateFrom=${dateAndTime.from}&dateTo=${dateAndTime.to}&pageNum=${activePage}&pageSize=15`,
      );
      setTransactions(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error(error.response);
    }
  };

  const onPageChange = async (e, { activePage }) => {
    setActivePage(activePage);
    const dateAndTime = {
      from: time.timeFrom ? date.dateFrom + ' ' + time.timeFrom : date.dateFrom,
      to: time.timeTo ? date.dateFrom + ' ' + time.timeTo : date.dateTo,
    };
    try {
      const response = await axios.get(
        `/user/terminals/transactions?terminalId=${acquirerTid}&dateFrom=${dateAndTime.from}&dateTo=${dateAndTime.to}&pageNum=${activePage}&pageSize=15`,
      );

      setTransactions(response.data.content);
    } catch (error) {
      console.error(error.response);
    }
  };

  return (
    <div className="transactionsContainer">
      <div className="transactionsHeader">
        <div className="transactionsNavBar">
          <Breadcrumb className="tableNavbar" icon="right angle" sections={sections} size="large" />
        </div>
        <div className="transactionsDate">
          <Form size="small" className="transactionsForm">
            <label className="dateLabel">Od: </label>
            <input
              type="date"
              placeholder={'Od'}
              name={'dateFrom'}
              defaultValue={date.dateFrom}
              onChange={onChangeDate}
            />
            <label className="dateLabel">Do: </label>
            <input
              type="date"
              placeholder={'Do'}
              name={'dateTo'}
              defaultValue={date.dateTo}
              onChange={onChangeDate}
            />

            <Button
              color="instagram"
              className="getTransactionsButton"
              disabled={disabled}
              onClick={onGetTransactions}>
              Pretrazi
            </Button>
          </Form>
        </div>
      </div>
      {loading ? (
        <CustomLoader />
      ) : (
        <div className="transactionsTable">
          <CustomTable
            tableHeader={transactionsTableHeader}
            content={transactions && formatTransactionsInstructedAmounts(transactions)}
            tableActions={terminalActionConfig}
            tableTotalPages={totalPages}
            tableActivePage={activePage}
            tableHandlePageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Transactions;
