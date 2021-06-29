import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { Button, Dropdown } from 'semantic-ui-react';
import _ from 'lodash';
import UserGroups from '../User/UserGroups/UserGroups';
import './CustomForm.scss';
import GroupRoles from '../Group/GroupRoles/GroupRoles';

const CustomForm = ({
  formConfig,
  formFields,
  setFormFields,
  formSubmitHandler,
  formErrors,
  formWarnings,
  setFormWarnings,
}) => {
  const history = useHistory();

  const onChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  const handleDropdown = (e, { name, value }) => {
    if (name === 'terminalTypeId' && value === 1) {
      setFormFields({ ...formFields, [name]: value, statusId: 200 });
    } else {
      setFormFields({ ...formFields, [name]: value });
    }

    if (formWarnings) {
      if (formWarnings.field === name && formFields['terminalTypeId'] === 1 && value !== 200) {
        setFormWarnings({ ...formWarnings, active: true });
      } else {
        if (formWarnings.active) {
          setFormWarnings({ ...formWarnings, active: false });
        }
      }
    }
  };

  const onSave = async () => {
    await formSubmitHandler(formFields);
  };

  const renderField = ({ key, title, type, options, disabled }) => {
    switch (type) {
      case 'DROPDOWN':
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
              disabled={disabled}
            />
            {formErrors && <p style={{ color: 'red' }}>{formErrors[key]}</p>}
            {formWarnings && formWarnings.active && formWarnings.field === key && (
              <p style={{ color: 'blue' }}>{formWarnings.message}</p>
            )}
          </>
        );
      case 'CHECKBOX':
        if (formFields.groupIds)
          return (
            <UserGroups
              userFields={formFields}
              setUserFields={setFormFields}
              errorMessage={formErrors ? formErrors[key] : null}
            />
          );
        if (formFields.roleIds)
          return (
            <GroupRoles
              groupFields={formFields}
              setGroupFields={setFormFields}
              errorMessage={formErrors ? formErrors[key] : null}
            />
          );
        break;

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
        {_.map(formConfig, (value, key) => (
          <Form.Field key={key}>
            {value.required ? (
              <label className="requiredField">{value.title}</label>
            ) : (
              <label
                className={
                  value.title === 'Grupe' || value.title === 'Uloge' ? 'groupField' : 'singleField'
                }>
                {value.title}
              </label>
            )}
            {renderField({ ...value })}
          </Form.Field>
        ))}
      </Form>
      <div className="buttonsWrapper">
        <Button color="instagram" onClick={() => history.goBack()}>
          Odustani
        </Button>
        <Button className="saveBtn" color="teal" onClick={onSave}>
          Sačuvaj
        </Button>
      </div>
    </div>
  );
};

CustomForm.propTypes = {
  formConfig: PropTypes.object,
  formFields: PropTypes.object,
  setFormFields: PropTypes.func,
  formSubmitHandler: PropTypes.func,
  formErrors: PropTypes.object,
  formWarnings: PropTypes.object,
  setFormWarnings: PropTypes.func,
};

export default CustomForm;
