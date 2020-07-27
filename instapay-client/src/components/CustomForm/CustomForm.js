import React, { useEffect } from 'react';
import { Form } from 'semantic-ui-react';
import { Button, Dropdown } from 'semantic-ui-react';
import _ from 'lodash';
import UserGroups from '../User/UserGroups/UserGroups';
import './CustomForm.scss';
import GroupRoles from '../Group/GroupRoles/GroupRoles';

const CustomForm = ({ formConfig, formFields, setFormFields, formSubmitHandler, formErrors }) => {
  const onChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  const handleDropdown = (e, { name, value }) => {
    setFormFields({ ...formFields, [name]: value });
  };

  const onSave = async () => {
    await formSubmitHandler(formFields);
  };

  const renderField = ({ key, title, type, options }) => {
    switch (type) {
      case 'DROPDOWN':
        console.log(options, 'opcije');
        console.log(formFields[key], 'formFields[key]');
        return (
          <>
            <Dropdown
              selection
              fluid
              options={options}
              name={key}
              value={formFields[key]}
              onChange={handleDropdown}
              placeholder="Odaberi opciju"
            />
            {formErrors && <p style={{ color: 'red' }}>{formErrors[key]}</p>}
          </>
        );
      case 'CHECKBOX':
        console.log(formFields, 'checkbox fields');
        if (formFields.groupIds)
          return <UserGroups userFields={formFields} setUserFields={setFormFields} />;
        if (formFields.roleIds)
          return <GroupRoles groupFields={formFields} setGroupFields={setFormFields} />;

      case 'TEXT':
      case 'PASSWORD':
      case 'NUMBER':
      case 'DATE':
        return (
          <>
            <input
              type={type}
              placeholder={title}
              name={key}
              defaultValue={formFields[key] ? formFields[key] : ''}
              onChange={onChange}
            />
            {formErrors && <p style={{ color: 'red' }}>{formErrors[key]}</p>}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="formWrapper">
      <Form>
        {_.map(formConfig, (value) => (
          <Form.Field>
            {value.required ? (
              <label className="requiredField">{value.title}</label>
            ) : (
              <label>{value.title}</label>
            )}
            {renderField({ ...value })}
          </Form.Field>
        ))}
      </Form>
      <div className="saveObj">
        <Button onClick={onSave}>Sačuvaj</Button>
      </div>
    </div>
  );
};

export default CustomForm;
