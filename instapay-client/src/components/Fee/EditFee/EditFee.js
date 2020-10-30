import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import { feeFormConfig, getFeeFormConfig } from '../utils/feeForm';
import './EditFee.scss';
import NotFound from '../../../security/NotFound/NotFound';

const EditFee = () => {
  const [loading, setLoading] = useState(false);
  const [feeMetadata, setFeeMetadata] = useState(null);
  const [formFields, setFormFields] = useState({ ...feeFormConfig });
  const [errors, setErrors] = useState(null);
  const [notFound, setNotFound] = useState(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetchFeeMetadata = async () => {
      try {
        const response = await axios.get('/user/fees/metadata');
        setFeeMetadata(response.data);
      } catch (err) {
        setErrors(err.response);
      }
    };
    const fetchFeeById = async (id) => {
      setLoading(true);
      try {
        const response = await axios.get(`/user/fees/${id}`);
        setFormFields({ ...response.data });
        setLoading(false);
      } catch (err) {
        setNotFound(err.response);
        setLoading(false);
      }
    };

    fetchFeeMetadata();
    fetchFeeById(id);
  }, []);

  const updateFee = async (updatedFee) => {
    setLoading(true);
    try {
      await axios.put(`/user/fees/${id}/update`, updatedFee);
      toast.success('Uspešno ste ažurirali proviziju');
      history.goBack();
      setLoading(false);
    } catch (err) {
      toast.error('Došlo je do greške pri ažuriranju provizije');
      setLoading(false);
      setErrors(err.response.data);
    }
  };

  return loading ? (
    <CustomLoader />
  ) : notFound ? (
    <NotFound message={notFound.data} />
  ) : (
    feeMetadata && (
      <>
        <h2 className="feeFormHeader">Izmena provizije</h2>
        <CustomForm
          formConfig={getFeeFormConfig(feeMetadata)}
          formFields={formFields}
          setFormFields={setFormFields}
          formSubmitHandler={updateFee}
          formErrors={errors}
        />
      </>
    )
  );
};

export default EditFee;
