import React, { useState, useEffect } from 'react';
import axios from '../../utils/API';
import { Button, Form, Dropdown } from 'semantic-ui-react';
import './TransactionsGlobal.scss';
import CustomTable from '../CustomTable/CustomTable';
import { transactionsTableHeader, terminalActionConfig } from './utils/transactionsTable';
import CustomLoader from '../CustomLoader/CustomLoader';

const TransactionsGlobal = () => {
  const [date, setDate] = useState({ dateFrom: '', dateTo: '' });
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [disabledTerminalChoice, setDisabledTerminalChoice] = useState(true);
  const [transactions, setTransactions] = useState({ list: null, dateRange: '' });
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [merchantsList, setMerchantsList] = useState(null);
  const [terminalsList, setTerminalsList] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState({ merchantId: '', merchantName: '' });
  const [selectedAcquirerTid, setSelectedAcquirerTid] = useState({
    acquirerId: '',
  });

  const getDate = () => {
    if (date.dateFrom && date.dateTo) {
      return `${date.dateFrom} - ${date.dateTo}`;
    }
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    return yyyy + '/' + mm + '/' + dd;
  };

  useEffect(() => {
    const fetchMerchantList = async () => {
      try {
        const merchantsRes = await axios.get('/user/merchants/names');
        setMerchantsList(merchantsRes.data);
      } catch (err) {
        console.error(err.response);
      }
    };

    const getDefaultTransactions = async () => {
      setLoading(true);
      try {
        const transactionsRes = await axios.get(
          `/user/terminals/transactions?pageNum=${activePage}&pageSize=15`,
        );

        setTransactions({ list: transactionsRes.data.content, dateRange: getDate() });
        setTotalPages(transactionsRes.data.totalPages);
        setLoading(false);
      } catch (err) {
        console.error(err.response);
      }
    };

    fetchMerchantList();
    getDefaultTransactions();
  }, []);

  useEffect(() => {
    const fetchTerminalList = async () => {
      try {
        const terminalsRes = await axios.get(
          `/user/terminals/names?merchantId=${selectedMerchant.merchantId}`,
        );
        setTerminalsList(terminalsRes.data);
        setTotalPages(terminalsRes.data.totalPages);
        setLoading(false);
      } catch (err) {
        console.error(err.response);
      }
    };

    if (selectedMerchant.merchantId) {
      fetchTerminalList();
      setDisabledTerminalChoice(false);
    }
  }, [selectedMerchant]);

  useEffect(() => {
    if ((date.dateFrom && !date.dateTo) || (!date.dateFrom && date.dateTo)) {
      setDisabled(true);
    }

    if ((date.dateFrom && date.dateTo) || (!date.dateFrom && !date.dateTo)) {
      setDisabled(false);
    }
  }, [date]);

  const onChangeDate = (e) => {
    setDate({ ...date, [e.target.name]: e.target.value });
  };

  const onGetTransactions = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `/user/terminals/transactions?merchantId=${selectedMerchant.merchantId}&terminalId=${selectedAcquirerTid.acquirerId}&dateFrom=${date.dateFrom}&dateTo=${date.dateTo}&pageNum=${activePage}&pageSize=15`,
      );
      setTransactions({
        list: response.data.content,
        dateRange: getDate(),
      });
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error(error.response);
    }
  };

  const onPageChange = async (e, { activePage }) => {
    setActivePage(activePage);
    setLoading(true);
    try {
      const response = await axios.get(
        `/user/terminals/transactions?merchantId=${selectedMerchant.merchantId}&terminalId=${selectedAcquirerTid.acquirerId}&dateFrom=${date.dateFrom}&dateTo=${date.dateTo}&pageNum=${activePage}&pageSize=15`,
      );

      setTransactions({ ...transactions, list: response.data.content });
      setLoading(false);
    } catch (error) {
      console.error(error.response);
    }
  };

  const handleMerchantDropdown = (e, { value }) => {
    setSelectedMerchant({ merchantId: value, merchantName: e.target.textContent });
  };

  const handleTerminalDropdown = (e, { value }) => {
    setSelectedAcquirerTid({ acquirerId: value });
  };

  const onReset = () => {
    setSelectedAcquirerTid({ acquirerId: '' });
    setSelectedMerchant({ merchantId: '', merchantName: '' });
    setDate({ dateFrom: '', dateTo: '' });
    setDisabledTerminalChoice(true);
  };

  return (
    <div className="transactionsGlobalContainer">
      <Form size="small" className="transactionsGlobalForm">
        <label className="dateLabel">Od: </label>
        <input
          type="date"
          placeholder={'Od'}
          name={'dateFrom'}
          value={date.dateFrom}
          onChange={onChangeDate}
          className="transactionsGlobalDate"
        />
        <label className="dateLabel">Do: </label>
        <input
          type="date"
          placeholder={'Do'}
          name={'dateTo'}
          value={date.dateTo}
          onChange={onChangeDate}
          className="transactionsGlobalDate"
        />
        <label className="dateLabel">Trgovac:</label>
        <Dropdown
          search
          selection
          className="transactionsGlobalDropdown"
          fluid
          options={
            merchantsList &&
            merchantsList.map(({ merchantId, merchantName }) => {
              return { value: merchantId, text: merchantName, key: merchantId };
            })
          }
          name="Trgovci"
          value={selectedMerchant.merchantId}
          onChange={handleMerchantDropdown}
          placeholder="Odaberi trgovca"
        />
        <label className="dateLabel">Terminal: </label>
        <Dropdown
          search
          selection
          fluid
          options={
            terminalsList &&
            terminalsList.map(({ acquirerId }) => {
              return { value: acquirerId, text: acquirerId, key: acquirerId };
            })
          }
          className="transactionsGlobalDropdown"
          name="Terminali"
          value={selectedAcquirerTid.acquirerId}
          onChange={handleTerminalDropdown}
          placeholder="Odaberi terminal"
          disabled={disabledTerminalChoice}
        />

        <div className="transactionsGlobalButtons">
          <Button color="red" className="getTransactionsButton" onClick={onReset}>
            Resetuj
          </Button>
          <Button
            color="instagram"
            className="getTransactionsButton"
            disabled={disabled}
            onClick={onGetTransactions}>
            Pretrazi
          </Button>
        </div>
      </Form>
      <div className="transactionsGlobalTable">
        {loading ? (
          <CustomLoader />
        ) : (
          <CustomTable
            tableHeader={transactionsTableHeader}
            content={transactions.list}
            tableActions={terminalActionConfig}
            tableTotalPages={totalPages}
            tableActivePage={activePage}
            tableHandlePageChange={onPageChange}
            tableTitle={`Transakcije za ${transactions.dateRange}`}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionsGlobal;
