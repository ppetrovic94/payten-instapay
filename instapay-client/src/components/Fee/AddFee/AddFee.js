import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import { getFeeFormConfig, feeFormTemplate } from '../utils/feeForm';
import './AddFee.scss';
import { Icon } from 'semantic-ui-react';

const AddFee = () => {
  const [loading, setLoading] = useState(false);
  const [feeMetadata, setFeeMetadata] = useState(null);
  const [formFields, setFormFields] = useState({ ...feeFormTemplate });
  const [errors, setErrors] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchFeeMetadata = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/user/fees/metadata');
        setFeeMetadata(response.data);
        setLoading(false);
      } catch (err) {
        setErrors(err.response);
        setLoading(false);
      }
    };
    fetchFeeMetadata();
  }, []);

  const saveFee = async () => {
    setLoading(true);
    try {
      await axios.post('/user/fees/add', formFields);
      toast.success('Uspešno ste dodali proviziju');
      setLoading(false);
      history.goBack();
    } catch (err) {
      toast.error('Došlo je do greške pri dodavanju provizije');
      setLoading(false);
      setErrors(err.response.data);
    }
  };

  return loading ? (
    <CustomLoader />
  ) : (
    feeMetadata && (
      <div>
        <div className="addFeeFormHeader" onClick={() => history.goBack()}>
          <div className="addFeeFormIconWrapper">
            <Icon name="angle left" />
            <p>Nazad</p>
          </div>

          <h2 className="addFeeFormTitle">Dodavanje provizije</h2>
        </div>
        <CustomForm
          formConfig={getFeeFormConfig(feeMetadata)}
          formFields={formFields}
          setFormFields={setFormFields}
          formSubmitHandler={saveFee}
          formErrors={errors}
        />
      </div>
    )
  );
};

export default AddFee;
