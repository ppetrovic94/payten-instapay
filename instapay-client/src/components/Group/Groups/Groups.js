import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomTable from '../../CustomTable/CustomTable';
import { Table } from 'semantic-ui-react';
import { groupTableHeader, formatGroupData } from '../utils/groupTable';
import './Groups.scss';

const Groups = () => {
  const [groups, setGroups] = useState(null);
  const [roles, setRoles] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/admin/groups`);
        setGroups(response.data.content);
      } catch (err) {
        setErrors(err.response);
      }
    };
    const fetchRoles = async () => {
      const response = await axios.get('http://localhost:8080/admin/roles');
      setRoles(response.data);
    };
    fetchGroups();
    fetchRoles();
  }, []);

  const onChangeSearchTerm = async (term) => {
    const filtered = await axios.get(`http://localhost:8080/admin/groups?searchTerm=${term}`);
    setGroups(filtered.data.content);
  };

  return (
    <div className="groupsAndRolesContainer">
      <div className="rolesContainer">
        <h2 className="groupsTitle">Uloge</h2>
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
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
      <div className="groupsContainer">
        <h2 className="groupsTitle">Grupe uloga</h2>
        <div className="groupsTable">
          <CustomTable
            tableAddItem={''}
            tableHeader={groupTableHeader}
            content={groups && formatGroupData(groups)}
            tableSearchHandler={onChangeSearchTerm}
          />
        </div>
      </div>
    </div>
  );
};

export default Groups;
