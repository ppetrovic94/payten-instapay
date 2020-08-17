import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import {
  terminalFormTemplate,
  getTerminalFormConfig,
  generateCredentials,
} from '../utils/terminalForm';
import './AddTerminal.scss';

const AddTerminal = () => {
  const [loading, setLoading] = useState(false);
  const [terminalMetadata, setTerminalMetadata] = useState(null);
  const [terminalFields, setTerminalFields] = useState({ ...terminalFormTemplate });
  const [terminalId, setTerminalId] = useState('');
  const [errors, setErrors] = useState(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetchTerminalMetadata = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/terminals/metadata');
        setTerminalMetadata(response.data);
      } catch (err) {
        setErrors(err.response);
      }
    };
    fetchTerminalMetadata();
  }, []);

  useEffect(() => {
    console.log(terminalId, 'USEEFFECT ZA TERMINALID');
    if (terminalId && terminalFields.terminalTypeId == '1') {
      console.log('terminalId', terminalId);
      console.log('USO JE DA GENERISE');
      generateCredentials(terminalId);
    }
    setLoading(false);
  }, [terminalId]);

  const saveTerminal = async () => {
    setLoading(true);
    try {
      const addedTerminal = await axios.post(
        `http://localhost:8080/api/user/pos/${id}/terminals/add`,
        terminalFields,
      );
      setTerminalId(addedTerminal.data.terminalId);
      history.push(`/pos/${id}/terminals`);
    } catch (err) {
      setLoading(false);
      setErrors(err.response.data);
    }
  };

  return loading ? (
    <CustomLoader />
  ) : (
    terminalMetadata && (
      <div>
        <h2 className="terminalFormHeader">Terminal</h2>
        <CustomForm
          formConfig={getTerminalFormConfig(terminalMetadata, true)}
          formFields={terminalFields}
          setFormFields={setTerminalFields}
          formSubmitHandler={saveTerminal}
          formErrors={errors}
        />
      </div>
    )
  );
};

export default AddTerminal;
