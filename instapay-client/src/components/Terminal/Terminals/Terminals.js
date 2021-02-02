import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../../utils/API';
import CustomTable from '../../CustomTable/CustomTable';
import {
  terminalTableHeader,
  formatTerminalData,
  terminalActionConfig,
} from '../utils/terminalTable';
import './Terminals.scss';
import NotFound from '../../../security/NotFound/NotFound';
import CustomLoader from '../../CustomLoader/CustomLoader';

const Terminals = () => {
  const [loading, setLoading] = useState(false);
  const [terminals, setTerminals] = useState(null);
  const [sections, setSections] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [credentialsOnMerchant, setCredentialsOnMerchant] = useState(false);
  const [errors, setErrors] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    localStorage.setItem('pointOfSaleId', id);
    const fetchNavbarData = async (id) => {
      const merchantId = localStorage.getItem('merchantId');
      try {
        const posName = await axios.get(`/user/pos/${id}/name`);
        const merchantName = await axios.get(`/user/merchants/${merchantId}/name`);
        const hasCredentials = await axios.get(`/user/merchants/${merchantId}/hasCredentials`);
        setSections([
          {
            key: 'merchantName',
            content: merchantName.data,
            href: `/ips/merchant/${merchantId}/pos`,
          },
          {
            key: 'pointOfSaleName',
            content: posName.data,
          },
          { key: 'terminals', content: 'Terminali' },
        ]);
        setCredentialsOnMerchant(hasCredentials.data);
      } catch (err) {
        setErrors(err.response);
      }
    };
    const fetchTerminals = async (id) => {
      setLoading(true);
      try {
        const response = await axios.get(`/user/pos/${id}/terminals`);
        setTerminals(response.data.content);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setErrors(err.response);
        setLoading(false);
      }
    };

    fetchNavbarData(id);
    fetchTerminals(id);
  }, [id]);

  const onPageChange = async (e, { activePage }) => {
    setActivePage(activePage);
    setLoading(true);
    let response = null;
    if (searchTerm) {
      response = await axios.get(
        `/user/pos/${id}/terminals?searchTerm=${searchTerm}&pagenum=${activePage - 1}`,
      );
    } else {
      response = await axios.get(`/user/pos/${id}/terminals?pagenum=${activePage - 1}`);
    }

    setTerminals(response.data.content);
    setLoading(false);
  };

  const onChangeSearchTerm = async (term) => {
    const filtered = await axios.get(`/user/pos/${id}/terminals?searchTerm=${term}`);
    setSearchTerm(term);
    setTotalPages(filtered.data.totalPages);
    setTerminals(filtered.data.content);
  };

  const onColumnSort = async (column, direction) => {
    let sortedTerminals;
    switch (column) {
      case 'status':
        sortedTerminals = await axios.get(
          `/user/pos/${id}/terminals?sortBy=status.statusName&searchTerm=${
            searchTerm ? searchTerm : ''
          }&direction=${direction}`,
        );
        setTerminals(sortedTerminals.data.content);
        break;
      default:
        sortedTerminals = await axios.get(
          `/user/pos/${id}/terminals?sortBy=${column}&searchTerm=${
            searchTerm ? searchTerm : ''
          }&direction=${direction}`,
        );
        setTerminals(sortedTerminals.data.content);
        break;
    }
  };

  return errors ? (
    <NotFound message={errors.data} />
  ) : loading ? (
    <CustomLoader />
  ) : (
    terminals && (
      <div className="terminalsTable">
        <CustomTable
          tableAddItem={`/ips/pos/${id}/terminals/add`}
          tableHeader={terminalTableHeader}
          tableActions={(id) => terminalActionConfig(id, credentialsOnMerchant)}
          content={formatTerminalData(terminals)}
          tableSearchHandler={onChangeSearchTerm}
          tableActivePage={activePage}
          tableHandlePageChange={onPageChange}
          tableTotalPages={totalPages}
          tableColumnSortHandler={onColumnSort}
          navbarSections={sections}
        />
      </div>
    )
  );
};

export default Terminals;
