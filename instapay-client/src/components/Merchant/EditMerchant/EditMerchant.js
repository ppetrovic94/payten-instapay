import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from '../../../utils/API';
import { getFormConfig, merchantFormTemplate } from '../utils/merchantForm';
import CustomForm from '../../CustomForm/CustomForm';
import CustomLoader from '../../CustomLoader/CustomLoader';
import './EditMerchant.scss';
import NotFound from '../../../security/NotFound/NotFound';

const EditMerchant = () => {
  const [loading, setLoading] = useState(false);
  const [merchantMetadata, setMerchantMetadata] = useState(null);
  const [formFields, setFormFields] = useState({ ...merchantFormTemplate });
  const [notFound, setNotFound] = useState(null);
  const [errors, setErrors] = useState(null);
  let { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchMerchantMetadata = async () => {
      try {
        const response = await axios.get('/user/merchants/metadata');
        setMerchantMetadata(response.data);
      } catch (err) {
        setErrors(err.response);
      }
    };
    const fetchMerchantById = async (id) => {
      setLoading(true);
      try {
        const response = await axios.get(`/user/merchants/${id}`);
        setFormFields({ ...response.data });
        setLoading(false);
      } catch (err) {
        setNotFound(err.response);
        setLoading(false);
      }
    };

    fetchMerchantMetadata();
    fetchMerchantById(id);
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
  ) : notFound ? (
    <NotFound message={notFound.data} />
  ) : (
    merchantMetadata &&
    formFields && (
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
