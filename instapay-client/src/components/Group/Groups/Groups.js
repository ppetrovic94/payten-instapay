import React, { useEffect, useState, useRef } from 'react';
import { Table, Icon, Pagination, Input, Button } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import axios from '../../../utils/API';
import TableActions from '../../TableActions/TableActions';
import { Link } from 'react-router-dom';
import { groupActionConfig } from '../utils/groupTable';
import './Groups.scss';
import CustomLoader from '../../CustomLoader/CustomLoader';

const Groups = () => {
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const intervalRef = useRef();
  const [roles, setRoles] = useState(null);

  useEffect(() => {
    fetchRoles();
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/groups');
      setGroups(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err.response);
    }
  };
  const fetchRoles = async () => {
    const response = await axios.get('/admin/roles');
    setRoles(response.data);
  };

  const onDeleteGroup = async (groupId) => {
    setLoading(true);
    try {
      await axios.delete(`/admin/groups/${groupId}/delete`);
      toast.success('Uspešno ste obrisali grupu uloga');
      setLoading(false);
      fetchGroups();
    } catch (error) {
      toast.error(error.response.data);
      console.error(error.response);
      setLoading(false);
    }
  };

  const onPageChange = async (e, { activePage }) => {
    setActivePage(activePage);
    let response = null;
    if (searchTerm) {
      response = await axios.get(
        `/admin/groups?searchTerm=${searchTerm}&pagenum=${activePage - 1}`,
      );
    } else {
      response = await axios.get(`/admin/groups?pagenum=${activePage - 1}`);
    }

    setGroups(response.data.content);
  };

  const getFilteredGroups = async (term) => {
    const filtered = await axios.get(`/admin/groups?searchTerm=${term}`);
    setSearchTerm(term);
    setTotalPages(filtered.data.totalPages);
    setGroups(filtered.data.content);
  };

  const onChangeSearchTerm = (e) => {
    const value = e.target.value;
    clearTimeout(intervalRef.current);
    intervalRef.current = setTimeout(() => getFilteredGroups(value), 350);
  };

  return loading ? (
    <CustomLoader />
  ) : (
    <div>
      <div className="groupsTable">
        <div className="groupsTableDetails">
          <div className="groupTableHeader">
            <h3 className="groupTitle">Grupe</h3>
            <div className="groupTableHeaderWrapper">
              <div>
                <Button as={Link} to={'/ips/groups/add'} color="black">
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
                        roles.map((role, key) => {
                          return group.roles.find(
                            (groupRole) => role.roleId === groupRole.roleId,
                          ) ? (
                            <Table.Cell key={key} textAlign="center">
                              <Icon color="green" name="checkmark" size="large" />
                            </Table.Cell>
                          ) : (
                            <Table.Cell key={key}></Table.Cell>
                          );
                        })}
                      <Table.Cell>
                        <TableActions
                          actions={groupActionConfig(group.groupId)}
                          onDeleteHandler={() => onDeleteGroup(group.groupId)}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </div>
          <div className="groupTablePageing">
            <Pagination
              siblingRange={null}
              activePage={activePage}
              onPageChange={onPageChange}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groups;
