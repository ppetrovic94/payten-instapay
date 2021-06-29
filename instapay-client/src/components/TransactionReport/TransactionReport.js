import React, { useState, useEffect } from 'react';
import axios from '../../utils/API';
import { Button, Form, Dropdown } from 'semantic-ui-react';
import CustomTable from '../CustomTable/CustomTable';
import { transactionReportTableHeader } from './utils/transactionReportTable';
import CustomLoader from '../CustomLoader/CustomLoader';
import './TransactionReport.scss';
import { toast } from 'react-toastify';

const TransactionReport = () => {
  const [date, setDate] = useState({ dateFrom: '', dateTo: '' });
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState(null);
  const [merchants, setMerchants] = useState(null);
  const [merchant, setMerchant] = useState({ merchantId: null, merchantName: '' });
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const getMerchants = async () => {
      try {
        const res = await axios.get('/user/merchants/names');
        setMerchants(res.data);
      } catch (error) {
        console.error(error.response);
      }
    };
    getMerchants();
  }, []);

  const onChangeDate = (e) => {
    if (e.target.name === 'dateFrom') {
      if (date.dateTo && e.target.value && merchant.merchantId) setDisabled(false);
    } else {
      if (date.dateFrom && e.target.value && merchant.merchantId) setDisabled(false);
    }

    setDate({ ...date, [e.target.name]: e.target.value });
  };

  const getTransactionsPreview = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `/acq/transactions?dateFrom=${date.dateFrom}&dateTo=${date.dateTo}&merchantId=${merchant.merchantId}`,
      );
      setTransactions(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error.response);
      setLoading(false);
    }
  };

  const handleDropdown = (e, { value }) => {
    if (value && date.dateFrom && date.dateTo) setDisabled(false);
    setMerchant({ merchantId: value, merchantName: e.target.textContent });
  };

  const showToastOnDownload = () => {
    toast.success('Fajl se eksportuje, sačekajte par sekundi do preuzimanja...', {
      autoClose: 15000,
    });
  };

  return (
    <>
      <h2 className="transactionReportTitle">IPS izveštaj</h2>
      <div className="transactionReportContainer">
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
            <label className="dateLabel">Trgovac: </label>

            <Dropdown
              selection
              options={
                merchants &&
                merchants.map(({ merchantId, merchantName }) => {
                  return { value: merchantId, text: merchantName };
                })
              }
              name={'Trgovci'}
              value={merchant.merchantId}
              onChange={handleDropdown}
              placeholder="Odaberi opciju"
            />

            <Button
              color="instagram"
              className="getTransactionsButton"
              disabled={disabled}
              onClick={getTransactionsPreview}>
              Pretrazi
            </Button>
            <Button
              as={'a'}
              href={`/ips/api/acq/exportIpsReport?dateFrom=${date.dateFrom}&dateTo=${date.dateTo}&merchantId=${merchant.merchantId}&merchantName=${merchant.merchantName}`}
              color="green"
              disabled={disabled}
              download
              onClick={showToastOnDownload}>
              .XLSX
            </Button>
          </Form>
        </div>
        {loading ? (
          <CustomLoader />
        ) : (
          <CustomTable
            tableHeader={transactionReportTableHeader}
            content={transactions && transactions}
            rotated={true}
          />
        )}
      </div>
    </>
  );
};

export default TransactionReport;
