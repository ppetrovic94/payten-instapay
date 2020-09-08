import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../utils/API';
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
      setLoading(true);
      try {
        const response = await axios.get('/user/merchants/metadata');
        setMerchantMetadata(response.data);
        setLoading(false);
      } catch (err) {
        setErrors(err.response);
        setLoading(false);
      }
    };
    fetchMerchantMetadata();
  }, []);

  const saveMerchant = async () => {
    setLoading(true);
    try {
      await axios.post('/user/merchants/add', formFields);
      toast.success(`Uspešno ste dodali trgovca ${formFields.merchantName}`);
      setLoading(false);
      history.push('/merchants');
    } catch (err) {
      toast.error('Došlo je do greške pri dodavanju trgovca');
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
