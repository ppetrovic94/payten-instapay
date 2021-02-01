import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import CustomForm from '../../CustomForm/CustomForm';
import { groupFormTemplate, groupFormConfig } from '../utils/groupForm';
import './EditGroup.scss';
import NotFound from '../../../security/NotFound/NotFound';
import { Icon } from 'semantic-ui-react';

const EditGroup = () => {
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({ ...groupFormTemplate });
  const [errors, setErrors] = useState(null);
  const [notFound, setNotFound] = useState(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetchGroupById = async (id) => {
      setLoading(true);
      try {
        const response = await axios.get(`/admin/groups/${id}`);

        setFormFields({ ...response.data });
        setLoading(false);
      } catch (err) {
        setNotFound(err.response);
        setLoading(false);
      }
    };
    fetchGroupById(id);
  }, [id]);

  const updateGroup = async (updatedGroup) => {
    setLoading(true);
    try {
      await axios.put(`/admin/groups/${id}/update`, updatedGroup);
      toast.success(`Uspešno ste ažurirali grupu ${updatedGroup.groupName}`);
      setLoading(false);
      history.push('/ips/groups');
    } catch (err) {
      toast.error('Došlo je do greške pri ažuriranju grupe');
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
      <div className="editGroupFormHeader" onClick={() => history.goBack()}>
        <div className="editGroupFormIconWrapper">
          <Icon name="angle left" />
          <p>Nazad</p>
        </div>
        <h2 className="editGroupFormTitle">Izmena grupe</h2>
      </div>

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
