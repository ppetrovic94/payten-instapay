import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import './GroupRoles.scss';

const GroupRoles = ({ groupFields, setGroupFields, errorMessage }) => {
  const [roles, setRoles] = useState(null);
  const [checkedRoles, setCheckedRoles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchRoles = async () => {
      try {
        const response = await axios.get('/admin/roles');
        setRoles(response.data);
        setLoading(false);
      } catch (err) {
        setErrors(err.response);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    let temp = {};

    if (roles) {
      roles.forEach((item) => {
        temp = {
          ...temp,
          [item.roleId]: !!groupFields.roleIds.find((el) => item.roleId === el) || false,
        };
      });
    }

    setCheckedRoles({ ...checkedRoles, ...temp });
  }, [groupFields, roles]);

  const onCheckboxClick = (e) => {
    setCheckedRoles({ ...checkedRoles, [e.target.value]: e.target.checked });
    if (e.target.checked) {
      setGroupFields({ ...groupFields, roleIds: [...groupFields.roleIds, e.target.value] });
    } else {
      setGroupFields({
        ...groupFields,
        roleIds: groupFields.roleIds.filter((elem) => elem != e.target.value),
      });
    }
  };

  return loading ? (
    <CustomLoader />
  ) : (
    <div className="checkboxContainer">
      <Table basic="very">
        <Table.Row>
          <Table.HeaderCell>Naziv</Table.HeaderCell>
          <Table.HeaderCell className="groupRoleDescription">Opis</Table.HeaderCell>
        </Table.Row>
        <Table.Body>
          {roles &&
            roles.map((role, key) => (
              <Table.Row key={key}>
                <Table.Cell>{role.roleName}</Table.Cell>
                <Table.Cell>{role.description}</Table.Cell>
                <Table.Cell>
                  <input
                    type="checkbox"
                    id={role.roleId}
                    onChange={onCheckboxClick}
                    value={role.roleId}
                    defaultChecked={checkedRoles[role.roleId]}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

GroupRoles.propTypes = {
  groupFields: PropTypes.object,
  setGroupFields: PropTypes.func,
  errorMessage: PropTypes.string,
};

export default GroupRoles;
