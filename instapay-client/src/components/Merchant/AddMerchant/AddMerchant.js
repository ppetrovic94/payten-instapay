import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import { merchantFormTemplate, getFormConfig } from '../utils/merchantForm';
import './AddMerchant.scss';

const AddMerchant = () => {
  const [loading, setLoading] = useState(false);
  const [merchantMetadata, setMerchantMetadata] = useState(null);
  const [formFields, setFormFields] = useState({ ...merchantFormTemplate });
  const [errors, setErrors] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchMerchantMetadata = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/merchants/metadata');
        setMerchantMetadata(response.data);
      } catch (err) {
        setErrors(err.response);
      }
    };
    fetchMerchantMetadata();
  }, []);

  const saveMerchant = async (merchant) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/user/merchants/add', merchant);
      setLoading(false);
      history.push('/');
    } catch (err) {
      console.log(err);
      setLoading(false);
      setErrors(err.response.data);
    }
  };

  return loading ? (
    <CustomLoader />
  ) : (
    merchantMetadata && (
      <div>
        <h2 className="merchantFormHeader">Dodavanje trgovca</h2>
        <CustomForm
          formConfig={getFormConfig(merchantMetadata)}
          formFields={formFields}
          setFormFields={setFormFields}
          formSubmitHandler={saveMerchant}
          formErrors={errors}
        />
      </div>
    )
  );
};

export default AddMerchant;
