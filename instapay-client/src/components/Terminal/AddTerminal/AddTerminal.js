import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import {
  terminalFormTemplate,
  getTerminalFormConfig,
  generateCredentials,
} from '../utils/terminalForm';
import './AddTerminal.scss';
import NotFound from '../../../security/NotFound/NotFound';

const AddTerminal = () => {
  const [loading, setLoading] = useState(false);
  const [terminalMetadata, setTerminalMetadata] = useState(null);
  const [pointOfSaleTitle, setPointOfSaleTitle] = useState('');
  const [terminalFields, setTerminalFields] = useState({ ...terminalFormTemplate });
  const [terminalId, setTerminalId] = useState('');
  const [errors, setErrors] = useState(null);
  const [notFound, setNotFound] = useState(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetchPointOfSaleName = async (id) => {
      try {
        const response = await axios.get(`/user/pos/${id}/name`);
        setPointOfSaleTitle(response.data);
      } catch (err) {
        setNotFound(err.response);
      }
    };
    const fetchTerminalMetadata = async () => {
      try {
        const response = await axios.get('/user/terminals/metadata');
        setTerminalMetadata(response.data);
      } catch (err) {
        setErrors(err.response);
      }
    };

    fetchPointOfSaleName(id);
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
      const addedTerminal = await axios.post(`/user/pos/${id}/terminals/add`, terminalFields);
      setTerminalId(addedTerminal.data.terminalId);
      history.push(`/pos/${id}/terminals`);
    } catch (err) {
      setLoading(false);
      setErrors(err.response.data);
    }
  };

  console.log(terminalFields, 'custom forma add terminals');

  return loading ? (
    <CustomLoader />
  ) : notFound ? (
    <NotFound message={notFound.data} />
  ) : (
    terminalMetadata && (
      <div>
        <h2 className="terminalFormHeader">{`${pointOfSaleTitle} - Dodavanje terminala`}</h2>
        <CustomForm
          formConfig={getTerminalFormConfig(terminalMetadata)}
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
