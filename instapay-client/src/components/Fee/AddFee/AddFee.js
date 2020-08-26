import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import { feeFormConfig, getFeeFormConfig } from '../utils/feeForm';
import './AddFee.scss';

const AddFee = () => {
  const [loading, setLoading] = useState(false);
  const [feeMetadata, setFeeMetadata] = useState(null);
  const [formFields, setFormFields] = useState({ ...feeFormConfig });
  const [errors, setErrors] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchFeeMetadata = async () => {
      try {
        const response = await axios.get('/user/fees/metadata');
        setFeeMetadata(response.data);
      } catch (err) {
        setErrors(err.response);
      }
    };
    fetchFeeMetadata();
  }, []);

  const saveFee = async () => {
    setLoading(true);
    try {
      await axios.post(`/user/fees/add`, formFields);
      setLoading(false);
      history.goBack();
    } catch (err) {
      console.log(err, 'greskaaaa');
      setLoading(false);
      setErrors(err.response.data);
    }
  };

  return loading ? (
    <CustomLoader />
  ) : (
    feeMetadata && (
      <div>
        <h2 className="feeFormHeader">Dodavanje provizije</h2>
        <CustomForm
          formConfig={getFeeFormConfig(feeMetadata)}
          formFields={formFields}
          setFormFields={setFormFields}
          formSubmitHandler={saveFee}
          formErrors={errors}
        />
      </div>
    )
  );
};

export default AddFee;
