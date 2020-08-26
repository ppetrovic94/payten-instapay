import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import { feeFormConfig, getFeeFormConfig } from '../utils/feeForm';
import './EditFee.scss';

const EditFee = () => {
  const [loading, setLoading] = useState(false);
  const [feeMetadata, setFeeMetadata] = useState(null);
  const [formFields, setFormFields] = useState({ ...feeFormConfig });
  const [errors, setErrors] = useState(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetchFeeMetadata = async () => {
      try {
        const response = await axios.get('/user/fees/metadata');
        setFeeMetadata(response.data);
      } catch (err) {
        setErrors(err.response);
      }
    };
    const fetchFeeById = async (id) => {
      try {
        const response = await axios.get(`/user/fees/${id}`);
        setFormFields({ ...response.data });
      } catch (err) {
        setErrors(err.response);
      }
    };

    fetchFeeMetadata();
    fetchFeeById(id);
  }, []);

  const updateFee = async (updatedFee) => {
    setLoading(true);
    try {
      await axios.put(`/user/fees/${id}/update`, updatedFee);
      setLoading(false);
      history.goBack();
    } catch (err) {
      setLoading(false);
      setErrors(err.response.data);
    }
  };

  return loading ? (
    <CustomLoader />
  ) : (
    feeMetadata && (
      <div>
        <h2 className="feeFormHeader">Izmena provizije</h2>
        <CustomForm
          formConfig={getFeeFormConfig(feeMetadata)}
          formFields={formFields}
          setFormFields={setFormFields}
          formSubmitHandler={updateFee}
          formErrors={errors}
        />
      </div>
    )
  );
};

export default EditFee;
