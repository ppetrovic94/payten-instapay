import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import { terminalFormTemplate, getTerminalFormConfig } from '../utils/terminalForm';
import './EditTerminal.scss';

const EditTerminal = () => {
  const [loading, setLoading] = useState(false);
  const [terminalMetadata, setTerminalMetadata] = useState(null);
  const [formFields, setFormFields] = useState({ ...terminalFormTemplate });
  const [errors, setErrors] = useState(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetchTerminalMetadata = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/terminals/metadata');
        setTerminalMetadata(response.data);
      } catch (err) {
        setErrors(err.response);
      }
    };

    const fetchTerminalById = async (id) => {
      try {
        const response = await axios.get(`http://localhost:8080/user/terminals/${id}`);
        setFormFields({ ...response.data });
      } catch (err) {
        setErrors(err.response);
      }
    };

    fetchTerminalMetadata();
    fetchTerminalById(id);
  }, [id]);

  const editTerminal = async (updatedTerminal) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/user/terminals/${id}/edit`, updatedTerminal);
      setLoading(false);
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
      <div className="terminalFormContainer">
        <h2 className="terminalFormHeader">Terminal</h2>
        <CustomForm
          formConfig={getTerminalFormConfig(terminalMetadata)}
          formFields={formFields}
          setFormFields={setFormFields}
          formSubmitHandler={editTerminal}
          formErrors={errors}
        />
      </div>
    )
  );
};

export default EditTerminal;
