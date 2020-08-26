import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import { pointOfSaleFormTemplate, getPointOfSaleFormConfig } from '../utils/pointOfSaleForm';
import './AddPointOfSale.scss';

const AddPointOfSale = () => {
  const [loading, setLoading] = useState(false);
  const [pointOfSaleMetadata, setPointOfSaleMetadata] = useState(null);
  const [formFields, setFormFields] = useState({ ...pointOfSaleFormTemplate });
  const [errors, setErrors] = useState(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetchMerchantMetadata = async () => {
      try {
        const response = await axios.get('/user/merchants/metadata');
        setPointOfSaleMetadata(response.data);
      } catch (err) {
        setErrors(err.response);
      }
    };
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
  ) : (
    pointOfSaleMetadata && (
      <div>
        <h2 className="pointOfSaleFormHeader">Prodajno mesto</h2>
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
