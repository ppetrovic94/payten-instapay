import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'semantic-ui-react';
import _ from 'lodash';
import CustomLoader from '../../CustomLoader/CustomLoader';
import './UserGroups.scss';

const UserGroups = ({ userFields, setUserFields }) => {
  const [groups, setGroups] = useState(null);
  const [checkedGroups, setCheckedGroups] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:8080/admin/users/groups');
        setGroups(response.data);
        setLoading(false);
      } catch (err) {
        setErrors(err.response);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    let temp = {};

    if (groups) {
      groups.forEach((item) => {
        temp = {
          ...temp,
          [item.groupId]: !!userFields.groupIds.find((el) => item.groupId == el) || false,
        };
      });
    }

    setCheckedGroups((checkedGroups) => ({ ...checkedGroups, ...temp }));
  }, [userFields, groups]);

  const onCheckboxClick = (e) => {
    setCheckedGroups({ ...checkedGroups, [e.target.value]: e.target.checked });
    if (e.target.checked) {
      setUserFields({ ...userFields, groupIds: [...userFields.groupIds, e.target.value] });
    } else {
      setUserFields({
        ...userFields,
        groupIds: userFields.groupIds.filter((elem) => elem != e.target.value),
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
          {groups &&
            groups.map((group, key) => (
              <Table.Row key={key}>
                <Table.Cell>{group.groupName}</Table.Cell>
                <Table.Cell>{group.description}</Table.Cell>
                <Table.Cell>
                  <input
                    type="checkbox"
                    id={group.groupId}
                    onChange={onCheckboxClick}
                    value={group.groupId}
                    checked={checkedGroups[group.groupId]}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default UserGroups;
