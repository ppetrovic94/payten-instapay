import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import { groupFormTemplate, groupFormConfig } from '../utils/groupForm';
import './AddGroup.scss';

const AddGroup = () => {
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({ ...groupFormTemplate });
  const [errors, setErrors] = useState(null);
  const history = useHistory();

  const saveGroup = async () => {
    setLoading(true);
    try {
      await axios.post('/admin/groups/add', formFields);
      toast.success(`Uspešno ste dodali grupu ${formFields.groupName}`);
      setLoading(false);
      history.push('/groups');
    } catch (err) {
      toast.error('Došlo je do greške pri dodavanju grupe');
      setLoading(false);
      setErrors(err.response.data);
    }
  };

  return loading ? (
    <CustomLoader />
  ) : (
    <div>
      <h2 className="groupFormHeader">Dodavanje grupe</h2>
      <CustomForm
        formConfig={groupFormConfig}
        formFields={formFields}
        setFormFields={setFormFields}
        formSubmitHandler={saveGroup}
        formErrors={errors}
      />
    </div>
  );
};

export default AddGroup;
