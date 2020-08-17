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
import './EditTerminal.scss';

const EditTerminal = () => {
  const [loading, setLoading] = useState(false);
  const [terminalMetadata, setTerminalMetadata] = useState(null);
  const [terminalFields, setTerminalFields] = useState({ ...terminalFormTemplate });
  const [currentTerminal, setCurrentTerminal] = useState({});
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

    const fetchTerminalById = async (id) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/terminals/${id}`);
        setTerminalFields({ ...response.data });
        setCurrentTerminal({ ...response.data });
      } catch (err) {
        setErrors(err.response);
      }
    };

    fetchTerminalMetadata();
    fetchTerminalById(id);
  }, [id]);

  useEffect(() => {
    if (
      terminalId &&
      currentTerminal.statusId !== terminalFields.statusId &&
      terminalFields.terminalTypeId == '1' &&
      terminalFields.statusId == '100'
    ) {
      console.log('terminalId', terminalId);
      console.log('USO JE DA GENERISE');
      generateCredentials(terminalId);
    }
    setLoading(false);
  }, [terminalId]);

  const editTerminal = async () => {
    setLoading(true);
    try {
      const updatedTerminal = await axios.put(
        `http://localhost:8080/api/user/terminals/${id}/edit`,
        terminalFields,
      );

      setTerminalId(updatedTerminal.data.terminalId);
      history.goBack();
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
          formConfig={getTerminalFormConfig(terminalMetadata, false)}
          formFields={terminalFields}
          setFormFields={setTerminalFields}
          formSubmitHandler={editTerminal}
          formErrors={errors}
        />
      </div>
    )
  );
};

export default EditTerminal;
