import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import axios from '../../../utils/API';
import CustomLoader from '../../CustomLoader/CustomLoader';
import './UserGroups.scss';

const UserGroups = ({ userFields, setUserFields, errorMessage }) => {
  const [groups, setGroups] = useState(null);
  const [checkedGroups, setCheckedGroups] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchGroups = async () => {
      try {
        const response = await axios.get('/admin/users/groups');
        setGroups(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err.response);
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
          [item.groupId]: !!userFields.groupIds.find((el) => item.groupId === el) || false,
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
        groupIds: userFields.groupIds.filter((elem) => {
          return elem != e.target.value;
        }),
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
          <Table.HeaderCell className="userGroupDescription">Opis</Table.HeaderCell>
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
                    defaultChecked={checkedGroups[group.groupId]}
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

UserGroups.propTypes = {
  userFields: PropTypes.object,
  setUserFields: PropTypes.func,
  errorMessage: PropTypes.string,
};

export default UserGroups;
