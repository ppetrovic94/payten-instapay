import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import { groupFormTemplate, groupFormConfig } from '../utils/groupForm';
import './AddGroup.scss';
import { Icon } from 'semantic-ui-react';

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
      history.push('/ips/groups');
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
      <div className="addGroupFormHeader" onClick={() => history.goBack()}>
        <div className="addGroupFormIconWrapper">
          <Icon name="angle left" />
          <p>Nazad</p>
        </div>
        <h2 className="addGroupFormTitle">Dodavanje grupe</h2>
      </div>
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
