import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import { userFormTemplate, userFormConfig } from '../utils/userForm';
import './EditUser.scss';
import NotFound from '../../../security/NotFound/NotFound';
import { Icon } from 'semantic-ui-react';

const EditUser = () => {
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({ ...userFormTemplate });
  const [errors, setErrors] = useState(null);
  const [notFound, setNotFound] = useState(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetchUserById = async (id) => {
      setLoading(true);
      try {
        const response = await axios.get(`/admin/users/${id}`);
        setFormFields({ ...response.data });
        setLoading(false);
      } catch (err) {
        setNotFound(err.response);
        setLoading(false);
      }
    };
    fetchUserById(id);
  }, [id]);

  const updateUser = async (user) => {
    setLoading(true);
    try {
      await axios.put(`/admin/users/${id}/edit`, user);
      toast.success(`Uspešno ste ažurirali korisnika ${user.username}`);
      setLoading(false);
      history.push('/ips/users');
    } catch (err) {
      toast.error(`Došlo je do greške pri ažuriranju korisnika ${user.username}`);
      setLoading(false);
      setErrors(err.response.data);
    }
  };

  return loading ? (
    <CustomLoader />
  ) : notFound ? (
    <NotFound message={notFound.data} />
  ) : (
    <>
      <div className="editUserFormHeader" onClick={() => history.goBack()}>
        <div className="editUserFormIconWrapper">
          <Icon name="angle left" />
          <p>Nazad</p>
        </div>
        <h2 className="editUserFormTitle">Izmena korisnika</h2>
      </div>
      <CustomForm
        formConfig={userFormConfig}
        formFields={formFields}
        setFormFields={setFormFields}
        formSubmitHandler={updateUser}
        formErrors={errors}
      />
    </>
  );
};

export default EditUser;
