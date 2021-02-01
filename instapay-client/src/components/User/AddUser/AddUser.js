import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import { userFormTemplate, userFormConfig } from '../utils/userForm';
import './AddUser.scss';
import { Icon } from 'semantic-ui-react';

const AddUser = () => {
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({ ...userFormTemplate });
  const [errors, setErrors] = useState(null);
  const history = useHistory();

  const saveUser = async () => {
    setLoading(true);
    try {
      await axios.post('/admin/users/add', formFields);
      toast.success(`Uspešno ste dodali novog korisnika ${formFields.username}`);
      setLoading(false);
      history.push('/ips/users');
    } catch (err) {
      toast.error('Došlo je do greške pri dodavanju novog korisnika');
      setLoading(false);
      setErrors(err.response.data);
    }
  };

  return loading ? (
    <CustomLoader />
  ) : (
    <div>
      <div className="addUserFormHeader" onClick={() => history.goBack()}>
        <div className="addUserFormIconWrapper">
          <Icon name="angle left" />
          <p>Nazad</p>
        </div>
        <h2 className="addUserFormTitle">Dodavanje korisnika</h2>
      </div>

      <CustomForm
        formConfig={userFormConfig}
        formFields={formFields}
        setFormFields={setFormFields}
        formSubmitHandler={saveUser}
        formErrors={errors}
      />
    </div>
  );
};

export default AddUser;
