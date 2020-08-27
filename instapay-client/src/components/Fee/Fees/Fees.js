import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../../utils/API';
import CustomTable from '../../CustomTable/CustomTable';
import { feeTableHeader, formatFeeData, feeActionConfig } from '../utils/feeTable';
import './Fees.scss';

const Fees = () => {
  const [fees, setFees] = useState(null);
  const [merchantName, setMerchantName] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchFeesByMerchantId = async (merchantId) => {
      try {
        const response = await axios.get(`/user/merchants/${merchantId}/fees`);
        setFees(response.data.content);
        setTotalPages(response.data.totalPages);
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
        setTotalPages(response.data.totalPages);
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

  const onPageChange = async (e, { activePage }) => {
    setActivePage(activePage);
    let response = null;
    if (searchTerm) {
      response = id
        ? await axios.get(
            `/user/merchants/${id}/fees?searchTerm=${searchTerm}&pagenum=${activePage - 1}`,
          )
        : await axios.get(`/user/fees?searchTerm=${searchTerm}&pagenum=${activePage - 1}`);
      console.log('res', response);
    } else {
      response = id
        ? await axios.get(`/user/merchants/${id}/fees?pagenum=${activePage - 1}`)
        : await axios.get(`/user/fees?pagenum=${activePage - 1}`);
    }

    setFees(response.data.content);
  };

  const onChangeSearchTerm = async (term) => {
    let filtered;
    if (id) {
      filtered = await axios.get(`/user/merchants/${id}/fees?searchTerm=${term}`);
    } else {
      filtered = await axios.get(`/user/fees?searchTerm=${term}`);
    }
    setSearchTerm(term);
    setTotalPages(filtered.data.totalPages);
    setFees(filtered.data.content);
  };

  const onColumnSort = async (column, direction) => {
    console.log('onColumnSort');
    console.log('---- column clicked', column, direction);
    let sortedFees;
    switch (column) {
      case 'merchant':
        sortedFees = id
          ? await axios.get(
              `/user/merchants/${id}/fees?sortBy=merchant.merchantName&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            )
          : await axios.get(
              `/user/fees?sortBy=merchant.merchantName&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            );
        setFees(sortedFees.data.content);
        break;
      case 'feeReceiver':
        sortedFees = id
          ? await axios.get(
              `/user/merchants/${id}/fees?sortBy=feeReceiver.receiverName&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            )
          : await axios.get(
              `/user/fees?sortBy=feeReceiver.receiverName&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            );
        setFees(sortedFees.data.content);
        break;
      case 'feeType':
        sortedFees = id
          ? await axios.get(
              `/user/merchants/${id}/fees?sortBy=feeType.typeName&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            )
          : await axios.get(
              `/user/fees?sortBy=feeType.typeName&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            );
        setFees(sortedFees.data.content);
        break;
      case 'productType':
        sortedFees = id
          ? await axios.get(
              `/user/merchants/${id}/fees?sortBy=productType.typeName&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            )
          : await axios.get(
              `/user/fees?sortBy=productType.typeName&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            );
        setFees(sortedFees.data.content);
        break;
      default:
        sortedFees = id
          ? await axios.get(
              `/user/merchants/${id}/fees?sortBy=${column}&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            )
          : await axios.get(
              `/user/fees?sortBy=${column}&searchTerm=${
                searchTerm ? searchTerm : ''
              }&direction=${direction}`,
            );
        setFees(sortedFees.data.content);
        break;
    }
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
          tableActivePage={activePage}
          tableHandlePageChange={onPageChange}
          tableTotalPages={totalPages}
          tableColumnSortHandler={onColumnSort}
        />
      </div>
    </div>
  );
};

export default Fees;
