import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import { pointOfSaleFormTemplate, getPointOfSaleFormConfig } from '../utils/pointOfSaleForm';
import './AddPointOfSale.scss';
import NotFound from '../../../security/NotFound/NotFound';

const AddPointOfSale = () => {
  const [loading, setLoading] = useState(false);
  const [pointOfSaleMetadata, setPointOfSaleMetadata] = useState(null);
  const [formFields, setFormFields] = useState({ ...pointOfSaleFormTemplate });
  const [merchantTitle, setMerchantTitle] = useState('');
  const [errors, setErrors] = useState(null);
  const [notFound, setNotFound] = useState(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetchMerchantName = async (id) => {
      try {
        const response = await axios.get(`/user/merchants/${id}/name`);
        setMerchantTitle(response.data);
      } catch (err) {
        setNotFound(err.response);
      }
    };
    const fetchMerchantMetadata = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/user/merchants/metadata');
        setPointOfSaleMetadata(response.data);
        setLoading(false);
      } catch (err) {
        setErrors(err.response);
        setLoading(false);
      }
    };
    fetchMerchantName(id);
    fetchMerchantMetadata();
  }, []);

  const savePointOfSale = async (pointOfSale) => {
    setLoading(true);
    try {
      await axios.post(`/user/merchant/${id}/pos/add`, pointOfSale);
      setLoading(false);
      history.push(`/merchant/${id}/pos`);
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
    pointOfSaleMetadata && (
      <div>
        <h2 className="pointOfSaleFormHeader">{`${merchantTitle} - Prodajno mesto`}</h2>
        <CustomForm
          formConfig={getPointOfSaleFormConfig(pointOfSaleMetadata)}
          formFields={formFields}
          setFormFields={setFormFields}
          formSubmitHandler={savePointOfSale}
          formErrors={errors}
        />
      </div>
    )
  );
};

export default AddPointOfSale;
