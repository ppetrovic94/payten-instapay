import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../utils/API';
import { getPointOfSaleFormConfig, pointOfSaleFormTemplate } from '../utils/pointOfSaleForm';
import CustomForm from '../../CustomForm/CustomForm';
import CustomLoader from '../../CustomLoader/CustomLoader';
import './EditPointOfSale.scss';
import NotFound from '../../../security/NotFound/NotFound';
import { Icon } from 'semantic-ui-react';

const EditPointOfSale = () => {
  const [loading, setLoading] = useState(false);
  const [pointOfSaleMetadata, setPointOfSaleMetadata] = useState(null);
  const [formFields, setFormFields] = useState({ ...pointOfSaleFormTemplate });
  const [merchantTitle, setMerchantTitle] = useState('');
  const [errors, setErrors] = useState(null);
  const [notFound, setNotFound] = useState(null);
  let { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchMerchantName = async () => {
      const merchantId = localStorage.getItem('merchantId');
      try {
        const response = await axios.get(`/user/merchants/${merchantId}/name`);
        setMerchantTitle(response.data);
      } catch (err) {
        setErrors(err.response);
      }
    };
    const fetchMerchantMetadata = async () => {
      try {
        const response = await axios.get('/user/merchants/metadata');
        setPointOfSaleMetadata(response.data);
      } catch (err) {
        setErrors(err.response);
      }
    };
    const fetchPointOfSaleById = async (id) => {
      setLoading(true);
      try {
        const response = await axios.get(`/user/pos/${id}`);

        setFormFields({ ...response.data });
        setLoading(false);
      } catch (err) {
        setNotFound(err.response);
        setLoading(false);
      }
    };

    fetchMerchantName();
    fetchMerchantMetadata();
    fetchPointOfSaleById(id);
  }, [id]);

  const editPointOfSale = async (updatedPointOfSale) => {
    setLoading(true);
    try {
      await axios.put(`/user/pos/${id}/edit`, updatedPointOfSale);
      toast.success(`Uspešno ste ažurirali prodajno mesto ${updatedPointOfSale.pointOfSaleName}`);
      setLoading(false);
      history.goBack();
    } catch (err) {
      toast.error('Došlo je do greške pri ažuriranju prodajnog mesta');
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
        <div className="editPointOfSaleFormHeader" onClick={() => history.goBack()}>
          <div className="editPointOfSaleFormIconWrapper">
            <Icon name="angle left" />
            <p>Nazad</p>
          </div>
          <h2 className="editPointOfSaleFormTitle">{`${merchantTitle} - Prodajno mesto`}</h2>
        </div>

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
