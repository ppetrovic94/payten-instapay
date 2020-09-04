import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import { terminalFormTemplate, getTerminalFormConfig } from '../utils/terminalForm';
import './EditTerminal.scss';
import NotFound from '../../../security/NotFound/NotFound';

const EditTerminal = () => {
  const [loading, setLoading] = useState(false);
  const [terminalMetadata, setTerminalMetadata] = useState(null);
  const [pointOfSaleTitle, setPointOfSaleTitle] = useState('');
  const [terminalFields, setTerminalFields] = useState({ ...terminalFormTemplate });
  const [notFound, setNotFound] = useState(null);
  const [errors, setErrors] = useState(null);

  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetchPointOfSaleName = async () => {
      const posId = localStorage.getItem('pointOfSaleId');
      try {
        const response = await axios.get(`/user/pos/${posId}/name`);
        setPointOfSaleTitle(response.data);
      } catch (err) {
        setErrors(err.response);
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

    const fetchTerminalById = async (id) => {
      try {
        const response = await axios.get(`/user/terminals/${id}`);
        setTerminalFields({ ...response.data });
      } catch (err) {
        setNotFound(err.response);
      }
    };
    fetchPointOfSaleName();
    fetchTerminalMetadata();
    fetchTerminalById(id);
  }, [id]);

  const editTerminal = async () => {
    setLoading(true);
    try {
      await axios.put(`/user/terminals/${id}/edit`, terminalFields);
      history.goBack();
    } catch (err) {
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
        <h2 className="terminalFormHeader">{`${pointOfSaleTitle} - Izmena terminala`}</h2>
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
