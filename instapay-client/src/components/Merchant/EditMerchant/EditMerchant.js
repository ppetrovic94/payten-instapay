import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from '../../../utils/API';
import { getFormConfig, merchantFormTemplate } from '../utils/merchantForm';
import CustomForm from '../../CustomForm/CustomForm';
import CustomLoader from '../../CustomLoader/CustomLoader';
import './EditMerchant.scss';

const EditMerchant = () => {
  const [loading, setLoading] = useState(false);
  const [merchantMetadata, setMerchantMetadata] = useState(null);
  const [formFields, setFormFields] = useState({ ...merchantFormTemplate });
  const [errors, setErrors] = useState(null);
  let { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    const fetchMerchantMetadata = async () => {
      try {
        const response = await axios.get('/user/merchants/metadata');
        setMerchantMetadata(response.data);
      } catch (err) {
        setErrors(err.response);
      }
    };
    const fetchMerchantById = async (id) => {
      try {
        const response = await axios.get(`/user/merchants/${id}`);
        setFormFields({ ...response.data });
      } catch (err) {
        setErrors(err.response);
      }
    };

    fetchMerchantMetadata();
    fetchMerchantById(id);
    setLoading(false);
  }, [id]);

  const editMerchant = async (updatedMerchant) => {
    setLoading(true);
    try {
      await axios.put(`/user/merchant/${id}/edit`, updatedMerchant);
      setLoading(false);
      history.push('/');
    } catch (err) {
      setLoading(false);
      setErrors(err.response.data);
    }
  };

  return loading ? (
    <CustomLoader />
  ) : (
    merchantMetadata && (
      <div>
        <h2 className="merchantFormHeader">Trgovac</h2>
        <CustomForm
          formConfig={getFormConfig(merchantMetadata)}
          formFields={formFields}
          setFormFields={setFormFields}
          formSubmitHandler={editMerchant}
          formErrors={errors}
        />
      </div>
    )
  );
};

export default EditMerchant;
