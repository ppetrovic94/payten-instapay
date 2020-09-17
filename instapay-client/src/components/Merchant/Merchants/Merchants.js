import React, { useEffect, useState } from 'react';
import axios from '../../../utils/API';
import CustomTable from '../../CustomTable/CustomTable';
import CustomLoader from '../../CustomLoader/CustomLoader';
import {
  merchantTableHeader,
  formatMerchantData,
  merchantActionConfig,
} from '../utils/merchantTable';
import './Merchants.scss';

const Merchants = () => {
  const [merchants, setMerchants] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const fetchMerchants = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/user/merchants?pagenum=0');

        const { content: merchants, totalPages } = (response && response.data) || {};
        setMerchants(merchants);
        setTotalPages(totalPages);
        setLoading(false);
      } catch (err) {
        setErrors(err.response);
      }
    };
    fetchMerchants();
  }, []);

  const onPageChange = async (e, { activePage }) => {
    setActivePage(activePage);
    let response = null;
    if (searchTerm) {
      response = await axios.get(
        `/user/merchants?searchTerm=${searchTerm}&pagenum=${activePage - 1}`,
      );
    } else {
      response = await axios.get(`/user/merchants?pagenum=${activePage - 1}`);
    }

    setMerchants(response.data.content);
  };

  const onChangeSearchTerm = async (term) => {
    const filtered = await axios.get(`/user/merchants?searchTerm=${term}`);
    setSearchTerm(term);
    setTotalPages(filtered.data.totalPages);
    setMerchants(filtered.data.content);
  };

  const onColumnSort = async (column, direction) => {
    let sortedMerchants;
    switch (column) {
      case 'city':
        sortedMerchants = await axios.get(
          `/user/merchants?sortBy=city.cityName&searchTerm=${
            searchTerm ? searchTerm : ''
          }&direction=${direction}`,
        );
        setMerchants(sortedMerchants.data.content);
        break;
      case 'status':
        sortedMerchants = await axios.get(
          `/user/merchants?sortBy=status.statusName&searchTerm=${
            searchTerm ? searchTerm : ''
          }&direction=${direction}`,
        );
        setMerchants(sortedMerchants.data.content);
        break;
      case 'paymentMethod':
        sortedMerchants = await axios.get(
          `/user/merchants?sortBy=paymentMethod.paymentMethodName&searchTerm=${
            searchTerm ? searchTerm : ''
          }&direction=${direction}`,
        );
        setMerchants(sortedMerchants.data.content);
        break;
      default:
        sortedMerchants = await axios.get(
          `/user/merchants?sortBy=${column}&searchTerm=${
            searchTerm ? searchTerm : ''
          }&direction=${direction}`,
        );
        setMerchants(sortedMerchants.data.content);
        break;
    }
  };

  return loading ? (
    <CustomLoader />
  ) : (
    merchants && (
      <div className="merchantsTable">
        <CustomTable
          tableTitle="Lista trgovaca"
          tableAddItem="/ips/merchants/add"
          tableHeader={merchantTableHeader}
          tableActions={merchantActionConfig}
          content={formatMerchantData(merchants)}
          tableSearchHandler={onChangeSearchTerm}
          tableActivePage={activePage}
          tableHandlePageChange={onPageChange}
          tableTotalPages={totalPages}
          tableColumnSortHandler={onColumnSort}
        />
      </div>
    )
  );
};

export default Merchants;
