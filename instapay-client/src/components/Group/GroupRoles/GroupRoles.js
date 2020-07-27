import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'semantic-ui-react';
import _ from 'lodash';
import CustomLoader from '../../CustomLoader/CustomLoader';
import './GroupRoles.scss';

const GroupRoles = ({ groupFields, setGroupFields }) => {
  const [roles, setRoles] = useState(null);
  const [checkedRoles, setCheckedRoles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/admin/roles');
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
          [item.roleId]: !!groupFields.roleIds.find((el) => item.roleId == el) || false,
        };
      });
    }

    setCheckedRoles((checkedRole) => ({ ...checkedRoles, ...temp }));
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
          <Table.HeaderCell>Opis</Table.HeaderCell>
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
                    checked={checkedRoles[role.roleId]}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default GroupRoles;
