import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import { userFormTemplate, userFormConfig } from '../utils/userForm';
import './EditUser.scss';

const EditUser = () => {
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({ ...userFormTemplate });
  const [errors, setErrors] = useState(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetchUserById = async (id) => {
      try {
        const response = await axios.get(`/admin/users/${id}`);
        setFormFields({ ...response.data });
      } catch (err) {
        setErrors(err.response);
      }
    };
    fetchUserById(id);
  }, [id]);

  const updateUser = async (user) => {
    setLoading(true);
    try {
      await axios.put(`/admin/users/${id}/edit`, user);
      setLoading(false);
      history.push('/users');
    } catch (err) {
      setLoading(false);
      setErrors(err.response.data);
    }
  };

  return loading ? (
    <CustomLoader />
  ) : (
    <div>
      <h2 className="userFormHeader">Izmena korisnika</h2>
      <CustomForm
        formConfig={userFormConfig}
        formFields={formFields}
        setFormFields={setFormFields}
        formSubmitHandler={updateUser}
        formErrors={errors}
      />
    </div>
  );
};

export default EditUser;
