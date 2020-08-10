import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Table, Icon, Pagination, Input, Button } from 'semantic-ui-react';
import TableActions from '../../TableActions/TableActions';
import { Link } from 'react-router-dom';
import { groupActionConfig } from '../utils/groupTable';
import './Groups.scss';

const Groups = () => {
  const [groups, setGroups] = useState(null);
  const intervalRef = useRef();
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

  const getFilteredGroups = async (term) => {
    const filtered = await axios.get(`http://localhost:8080/admin/groups?searchTerm=${term}`);
    setGroups(filtered.data.content);
  };

  const onChangeSearchTerm = (e) => {
    const value = e.target.value;
    clearTimeout(intervalRef.current);
    intervalRef.current = setTimeout(() => getFilteredGroups(value), 350);
  };

  const onPageChange = () => {};

  return (
    <div>
      <div className="groupsTable">
        <div className="groupsTableDetails">
          <div className="groupTableHeader">
            <h3 className="groupTitle">Grupe</h3>
            <div className="groupTableHeaderWrapper">
              <div>
                <Button as={Link} to={'/groups/add'} color="black">
                  Dodaj
                </Button>
              </div>
              <div className="groupTableSearch">
                <Input
                  icon={{ name: 'search', circular: true, link: true }}
                  placeholder="Pretraži..."
                  type="text"
                  onChange={onChangeSearchTerm}
                />
              </div>
            </div>
          </div>
          <div className="groupTableContent">
            <Table collapsing celled structured>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell rowSpan="2">Naziv</Table.HeaderCell>
                  <Table.HeaderCell rowSpan="2">Opis</Table.HeaderCell>
                  {roles && (
                    <Table.HeaderCell textAlign="center" colSpan={roles.length}>
                      Uloge
                    </Table.HeaderCell>
                  )}
                  <Table.HeaderCell rowSpan="2">Akcije</Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                  {roles &&
                    roles.map((role, key) => (
                      <Table.HeaderCell key={key}>{role.roleName}</Table.HeaderCell>
                    ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {groups &&
                  groups.map((group, key) => (
                    <Table.Row key={key}>
                      <Table.Cell>{group.groupName}</Table.Cell>
                      <Table.Cell>{group.description}</Table.Cell>
                      {roles &&
                        roles.map((role) => {
                          return !!group.roles.find(
                            (groupRole) => role.roleId == groupRole.roleId,
                          ) ? (
                            <Table.Cell textAlign="center">
                              <Icon color="green" name="checkmark" size="large" />
                            </Table.Cell>
                          ) : (
                            <Table.Cell></Table.Cell>
                          );
                        })}
                      <Table.Cell>
                        <TableActions actionConfig={groupActionConfig} actionKey={group.groupId} />
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
          <div className="groupTablePageing">
            <Pagination
              siblingRange={null}
              activePage={0}
              onPageChange={onPageChange}
              totalPages={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;
