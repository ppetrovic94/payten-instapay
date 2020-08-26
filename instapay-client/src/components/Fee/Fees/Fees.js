import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../../utils/API';
import CustomTable from '../../CustomTable/CustomTable';
import { feeTableHeader, formatFeeData, feeActionConfig } from '../utils/feeTable';
import './Fees.scss';

const Fees = () => {
  const [fees, setFees] = useState(null);
  const [merchantName, setMerchantName] = useState(null);
  const [errors, setErrors] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchFeesByMerchantId = async (merchantId) => {
      try {
        const response = await axios.get(`/user/merchants/${merchantId}/fees`);
        setFees(response.data.content);
        if (response.data.content[0]) {
          setMerchantName(response.data.content[0].merchant.merchantName);
        } else {
          const res = await axios.get(`/user/merchants/${merchantId}/name`);
          setMerchantName(res.data);
        }
      } catch (err) {
        setErrors(err.response);
      }
    };
    const fetchFees = async () => {
      try {
        const response = await axios.get(`/user/fees`);
        setFees(response.data.content);
      } catch (err) {
        setErrors(err.response);
      }
    };

    if (id) {
      fetchFeesByMerchantId(id);
    } else {
      fetchFees();
    }
    return () => {
      setFees(null);
      setMerchantName(null);
      setErrors(null);
    };
  }, [id]);

  const onChangeSearchTerm = async (term) => {
    let filtered;
    if (id) {
      filtered = await axios.get(`/user/merchants/${id}/fees?searchTerm=${term}`);
    } else {
      filtered = await axios.get(`/user/fees?searchTerm=${term}`);
    }
    setFees(filtered.data.content);
  };

  return (
    <div>
      <div className="feesTable">
        <CustomTable
          tableTitle={merchantName ? `${merchantName} - Provizije` : 'Provizije'}
          tableAddItem={'/fees/add'}
          tableHeader={feeTableHeader}
          content={fees && formatFeeData(fees)}
          tableSearchHandler={onChangeSearchTerm}
          tableActions={feeActionConfig}
        />
      </div>
    </div>
  );
};

export default Fees;
