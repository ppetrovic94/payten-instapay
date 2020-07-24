import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { getPointOfSaleFormConfig, pointOfSaleFormTemplate } from '../utils/pointOfSaleForm';
import CustomForm from '../../CustomForm/CustomForm';
import CustomLoader from '../../CustomLoader/CustomLoader';
import './EditPointOfSale.scss';

const EditPointOfSale = () => {
  const [loading, setLoading] = useState(false);
  const [pointOfSaleMetadata, setPointOfSaleMetadata] = useState(null);
  const [formFields, setFormFields] = useState({ ...pointOfSaleFormTemplate });
  const [errors, setErrors] = useState(null);
  let { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    const fetchMerchantMetadata = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/merchants/metadata');
        setPointOfSaleMetadata(response.data);
      } catch (err) {
        setErrors(err.response);
      }
    };
    const fetchPointOfSaleById = async (id) => {
      try {
        const response = await axios.get(`http://localhost:8080/user/pos/${id}`);
        console.log(response, 'response pos');
        setFormFields({ ...response.data });
      } catch (err) {
        setErrors(err.response);
      }
    };

    fetchMerchantMetadata();
    fetchPointOfSaleById(id);
    setLoading(false);
  }, [id]);

  const editPointOfSale = async (updatedPointOfSale) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/user/pos/${id}/edit`, updatedPointOfSale);
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
    pointOfSaleMetadata && (
      <div className="pointOfSaleFormContainer">
        <h2 className="pointOfSaleFormHeader">Prodajno mesto</h2>
        <CustomForm
          formConfig={getPointOfSaleFormConfig(pointOfSaleMetadata)}
          formFields={formFields}
          setFormFields={setFormFields}
          formSubmitHandler={editPointOfSale}
          formErrors={errors}
        />
      </div>
    )
  );
};

export default EditPointOfSale;
