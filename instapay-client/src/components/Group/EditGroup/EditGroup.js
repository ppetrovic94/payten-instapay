import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import { groupFormTemplate, groupFormConfig } from '../utils/groupForm';
import './EditGroup.scss';
import NotFound from '../../../security/NotFound/NotFound';

const EditGroup = () => {
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({ ...groupFormTemplate });
  const [errors, setErrors] = useState(null);
  const [notFound, setNotFound] = useState(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetchGroupById = async (id) => {
      try {
        const response = await axios.get(`/admin/groups/${id}`);
        console.log(response, 'response grupa ');
        setFormFields({ ...response.data });
      } catch (err) {
        setNotFound(err.response);
      }
    };
    fetchGroupById(id);
  }, [id]);

  const updateGroup = async (updatedGroup) => {
    setLoading(true);
    try {
      await axios.put(`/admin/groups/${id}/update`, updatedGroup);
      setLoading(false);
      history.push('/groups');
    } catch (err) {
      setLoading(false);
      setErrors(err.response.data);
    }
  };

  console.log(formFields, 'formaa trenutno');

  return loading ? (
    <CustomLoader />
  ) : notFound ? (
    <NotFound message={notFound.data} />
  ) : (
    <>
      <h2 className="groupFormHeader">Izmena grupe</h2>
      <CustomForm
        formConfig={groupFormConfig}
        formFields={formFields}
        setFormFields={setFormFields}
        formSubmitHandler={updateGroup}
        formErrors={errors}
      />
    </>
  );
};

export default EditGroup;
