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

const Terminals = () => {
  const [terminals, setTerminals] = useState(null);
  const [pointOfSaleTitle, setPointOfSaleTitle] = useState('');
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    localStorage.setItem('pointOfSaleId', id);
    const fetchPointOfSaleName = async (id) => {
      try {
        const response = await axios.get(`/user/pos/${id}/name`);
        setPointOfSaleTitle(response.data);
      } catch (err) {
        setErrors(err.response);
      }
    };
    const fetchTerminals = async (id) => {
      try {
        const response = await axios.get(`/user/pos/${id}/terminals`);
        setTerminals(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setErrors(err.response);
      }
    };

    fetchPointOfSaleName(id);
    fetchTerminals(id);
  }, [id]);

  const onPageChange = async (e, { activePage }) => {
    setActivePage(activePage);
    let response = null;
    if (searchTerm) {
      response = await axios.get(
        `/user/pos/${id}/terminals?searchTerm=${searchTerm}&pagenum=${activePage - 1}`,
      );
      console.log('res', response);
    } else {
      response = await axios.get(`/user/pos/${id}/terminals?pagenum=${activePage - 1}`);
    }

    setTerminals(response.data.content);
  };

  const onChangeSearchTerm = async (term) => {
    const filtered = await axios.get(`/user/pos/${id}/terminals?searchTerm=${term}`);
    setSearchTerm(term);
    setTotalPages(filtered.data.totalPages);
    setTerminals(filtered.data.content);
  };

  const onColumnSort = async (column, direction) => {
    console.log('onColumnSort');
    console.log('---- column clicked', column, direction);
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
  ) : (
    <div className="terminalsTable">
      <CustomTable
        tableTitle={`${pointOfSaleTitle} - Terminali`}
        tableAddItem={`/pos/${id}/terminals/add`}
        tableHeader={terminalTableHeader}
        tableActions={terminalActionConfig}
        content={terminals && formatTerminalData(terminals)}
        tableSearchHandler={onChangeSearchTerm}
        tableActivePage={activePage}
        tableHandlePageChange={onPageChange}
        tableTotalPages={totalPages}
        tableColumnSortHandler={onColumnSort}
      />
    </div>
  );
};

export default Terminals;
