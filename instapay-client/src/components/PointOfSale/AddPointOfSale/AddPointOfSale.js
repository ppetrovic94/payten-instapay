import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import { pointOfSaleFormTemplate, getPointOfSaleFormConfig } from '../utils/pointOfSaleForm';
import './AddPointOfSale.scss';
import NotFound from '../../../security/NotFound/NotFound';
import { Icon } from 'semantic-ui-react';

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
      toast.success(`Uspešno ste dodali prodajno mesto ${pointOfSale.pointOfSaleName}`);
      setLoading(false);
      history.push(`/ips/merchant/${id}/pos`);
    } catch (err) {
      toast.error('Došlo je do greške pri dodavanju prodajnog mesta');
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
        <div className="addPointOfSaleFormHeader" onClick={() => history.goBack()}>
          <div className="addPointOfSaleFormIconWrapper">
            <Icon name="angle left" />
            <p>Nazad</p>
          </div>
          <h2 className="addPointOfSaleFormTitle">{`${merchantTitle} - Prodajno mesto`}</h2>
        </div>

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
