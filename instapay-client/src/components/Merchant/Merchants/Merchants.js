import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomTable from '../../CustomTable/CustomTable';
import {
  merchantTableHeader,
  formatMerchantData,
  merchantActionConfig,
} from '../utils/merchantTable';
import './Merchants.scss';

const Merchants = () => {
  const [merchants, setMerchants] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/merchants?pagenum=0');
        console.log(response);
        const { content: merchants, totalPages } = (response && response.data) || {};
        setMerchants(merchants);
        setTotalPages(totalPages);
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
        `http://localhost:8080/user/merchants?searchTerm=${searchTerm}&pagenum=${activePage - 1}`,
      );
      console.log('res', response);
    } else {
      response = await axios.get(`http://localhost:8080/user/merchants?pagenum=${activePage - 1}`);
    }

    setMerchants(response.data.content);
  };

  const onChangeSearchTerm = async (term) => {
    const filtered = await axios.get(`http://localhost:8080/user/merchants?searchTerm=${term}`);
    setSearchTerm(term);
    setTotalPages(filtered.data.totalPages);
    setMerchants(filtered.data.content);
  };

  const onColumnSort = async (column, direction) => {
    console.log('onColumnSort');
    console.log('---- column clicked', column, direction);
    let sortedMerchants;
    switch (column) {
      case 'city':
        sortedMerchants = await axios.get(
          `http://localhost:8080/user/merchants?sortBy=city.cityName&searchTerm=${
            searchTerm ? searchTerm : ''
          }&direction=${direction}`,
        );
        setMerchants(sortedMerchants.data.content);
        break;
      case 'status':
        sortedMerchants = await axios.get(
          `http://localhost:8080/user/merchants?sortBy=status.statusName&searchTerm=${
            searchTerm ? searchTerm : ''
          }&direction=${direction}`,
        );
        setMerchants(sortedMerchants.data.content);
        break;
      case 'paymentMethod':
        sortedMerchants = await axios.get(
          `http://localhost:8080/user/merchants?sortBy=paymentMethod.paymentMethodName&searchTerm=${
            searchTerm ? searchTerm : ''
          }&direction=${direction}`,
        );
        setMerchants(sortedMerchants.data.content);
        break;
      default:
        sortedMerchants = await axios.get(
          `http://localhost:8080/user/merchants?sortBy=${column}&searchTerm=${
            searchTerm ? searchTerm : ''
          }&direction=${direction}`,
        );
        setMerchants(sortedMerchants.data.content);
        break;
    }
  };

  return (
    <div className="merchantsContainer">
      <h2 className="merchantsTitle">Trgovci</h2>
      <div className="merchantsTable">
        <CustomTable
          tableAddItem="/addMerchant"
          tableHeader={merchantTableHeader}
          tableActions={merchantActionConfig}
          content={merchants && formatMerchantData(merchants)}
          tableSearchHandler={onChangeSearchTerm}
          tableActivePage={activePage}
          tableHandlePageChange={onPageChange}
          tableTotalPages={totalPages}
          tableColumnSortHandler={onColumnSort}
        />
      </div>
    </div>
  );
};

export default Merchants;
