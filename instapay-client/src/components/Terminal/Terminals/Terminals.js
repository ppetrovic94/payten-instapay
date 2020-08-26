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

const Terminals = () => {
  const [terminals, setTerminals] = useState(null);
  const [errors, setErrors] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchTerminals = async () => {
      try {
        const response = await axios.get(`/user/pos/${id}/terminals`);
        setTerminals(response.data.content);
      } catch (err) {
        setErrors(err.response);
      }
    };
    fetchTerminals();
  }, [id]);

  const onChangeSearchTerm = async (term) => {
    const filtered = await axios.get(`/user/pos/${id}/terminals?searchTerm=${term}`);
    setTerminals(filtered.data.content);
  };

  return (
    <div>
      <div className="terminalsTable">
        <CustomTable
          tableTitle="Terminali"
          tableAddItem={`/pos/${id}/terminals/add`}
          tableHeader={terminalTableHeader}
          tableActions={terminalActionConfig}
          content={terminals && formatTerminalData(terminals)}
          tableSearchHandler={onChangeSearchTerm}
        />
      </div>
    </div>
  );
};

export default Terminals;
