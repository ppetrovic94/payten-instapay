import React, { useState, useEffect } from 'react';
import axios from '../../utils/API';
import { Button, Form, Dropdown, Input } from 'semantic-ui-react';
import './TransactionsGlobal.scss';
import CustomTable from '../CustomTable/CustomTable';
import {
  transactionsTableHeader,
  terminalActionConfig,
  formatTransactionsInstructedAmounts,
} from './utils/transactionsTable';
import CustomLoader from '../CustomLoader/CustomLoader';
import { transactionDetailsTableHeader, formatTerminalDetails } from './utils/transactionsTable';
import CustomModal from '../CustomModal/CustomModal';

const TransactionsGlobal = () => {
  const [date, setDate] = useState({ dateFrom: '', dateTo: '' });
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [disabledTerminalChoice, setDisabledTerminalChoice] = useState(true);
  const [transactions, setTransactions] = useState({ list: null, dateRange: '' });
  const [details, setDetails] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [merchantsList, setMerchantsList] = useState(null);
  const [terminalsList, setTerminalsList] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState({ merchantId: '', merchantName: '' });
  const [selectedAcquirerTid, setSelectedAcquirerTid] = useState({
    acquirerId: '',
  });
  const [transactionReference, setTransactionReference] = useState('');
  const [error, setError] = useState(null);

  const getDate = () => {
    if (date.dateFrom && date.dateTo) {
      return `${date.dateFrom.replace(/-/g, '/')} - ${date.dateTo.replace(/-/g, '/')}`;
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
    setSelectedAcquirerTid({ acquirerId: '' });
  };

  const handleTerminalDropdown = (e, { value }) => {
    setSelectedAcquirerTid({ acquirerId: value });
  };

  const onChangeTerminalInput = (e) => {
    setSelectedAcquirerTid({ acquirerId: e.target.value });
  };

  const onReset = () => {
    setSelectedAcquirerTid({ acquirerId: '' });
    setSelectedMerchant({ merchantId: '', merchantName: '' });
    setDate({ dateFrom: '', dateTo: '' });
    setDisabledTerminalChoice(true);
  };

  const onChangeReference = (e) => {
    setTransactionReference(e.target.value);
  };

  const onGetTransactionDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/user/terminals/transactions/${transactionReference}`);
      setDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error.response);
      setError(
        `Došlo je do greške pri dobijanju detalja transakcije za referencu:  ${transactionReference}`,
      );
      setLoading(false);
    }
  };

  const detailsContent = () => {
    return loading ? (
      <CustomLoader />
    ) : (
      <>
        {details && (
          <CustomTable
            tableTitle={`Detalji transakcije - ${transactionReference}`}
            content={formatTerminalDetails(details)}
            tableHeader={transactionDetailsTableHeader}
          />
        )}
        {error && (
          <div className="errorContainer">
            <p style={{ fontSize: '20px', fontWeight: '500' }}>{error}</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="transactionsGlobalContainer">
      <Form size="small" className="transactionsGlobalForm">
        <label className="transactionsGlobalDateLabel">Od: </label>
        <input
          type="date"
          placeholder={'Od'}
          name={'dateFrom'}
          value={date.dateFrom}
          onChange={onChangeDate}
          className="transactionsGlobalDate"
        />
        <label className="transactionsGlobalDateLabel">Do: </label>
        <input
          type="date"
          placeholder={'Do'}
          name={'dateTo'}
          value={date.dateTo}
          onChange={onChangeDate}
          className="transactionsGlobalDate"
        />
        <label className="transactionsGlobalDateLabel">Trgovac:</label>
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
        <label className="transactionsGlobalDateLabel">Terminal: </label>
        {selectedMerchant.merchantId ? (
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
        ) : (
          <Input
            className="transactionsGlobalTerminalInput"
            onChange={onChangeTerminalInput}
            placeholder="Unesite TID"
          />
        )}

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
        <div className="transactionsGlobalDetailsContainer">
          <label className="transactionsGlobalDateLabel">E2E referenca: </label>
          <Input
            className="transactionsGlobalDetailsInput"
            onChange={onChangeReference}
            placeholder="Unesite E2E referencu"
          />
          <CustomModal
            content={detailsContent}
            onOpenHandler={onGetTransactionDetails}
            triggerElement={() => (
              <Button
                className="transactionsGlobalDetailsTrigger"
                disabled={!transactionReference}
                color="twitter">
                Prikazi detalje
              </Button>
            )}
            size="large"
          />
        </div>
      </Form>
      <div className="transactionsGlobalTable">
        {loading ? (
          <CustomLoader />
        ) : (
          <CustomTable
            tableHeader={transactionsTableHeader}
            content={transactions.list && formatTransactionsInstructedAmounts(transactions.list)}
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
