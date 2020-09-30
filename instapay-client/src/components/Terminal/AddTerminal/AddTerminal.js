/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import { terminalFormTemplate, getTerminalFormConfig } from '../utils/terminalForm';
import './AddTerminal.scss';
import NotFound from '../../../security/NotFound/NotFound';

const AddTerminal = () => {
  const [loading, setLoading] = useState(false);
  const [terminalMetadata, setTerminalMetadata] = useState(null);
  const [pointOfSaleTitle, setPointOfSaleTitle] = useState('');
  const [terminalFields, setTerminalFields] = useState({ ...terminalFormTemplate });
  const [terminalId, setTerminalId] = useState(null);
  const [errors, setErrors] = useState(null);
  const [warnings, setWarnings] = useState({
    active: false,
    field: 'statusId',
    message: 'Da bi se novi ANDROID terminal aktivirao, mora da bude u statusu Inactive',
  });
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
      setLoading(true);
      try {
        const response = await axios.get('/user/terminals/metadata');
        setTerminalMetadata(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setErrors(err.response);
      }
    };

    fetchPointOfSaleName(id);
    fetchTerminalMetadata();
  }, []);

  const generateCredentials = async (terminalId) => {
    setLoading(true);
    try {
      await axios.get(`/user/terminals/${terminalId}/generateCredentials`);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err.response);
    }
  };

  useEffect(() => {
    if (terminalId) {
      if (terminalFields.terminalTypeId === 1) {
        generateCredentials(terminalId);
      }
      history.goBack();
      setLoading(false);
    }
  }, [terminalId]);

  const saveTerminal = async () => {
    setLoading(true);
    try {
      const addedTerminal = await axios.post(`/user/pos/${id}/terminals/add`, terminalFields);
      toast.success(`Uspešno ste dodali terminal ${terminalFields.acquirerTid}`);
      setTerminalId(addedTerminal.data.terminalId);
    } catch (err) {
      toast.error('Došlo je do greške pri dodavanju terminala');
      setLoading(false);
      setErrors(err.response.data);
    }
  };

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
          formWarnings={warnings}
          setFormWarnings={setWarnings}
        />
      </div>
    )
  );
};

export default AddTerminal;
