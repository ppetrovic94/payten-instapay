import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../../utils/API';
import CustomTable from '../../CustomTable/CustomTable';
import { userTableHeader, formatUserData, userActionConfig } from '../utils/userTable';
import './Users.scss';
import CustomLoader from '../../CustomLoader/CustomLoader';

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/users');
      setUsers(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setErrors(err.response);
      setLoading(false);
    }
  };

  const onDeleteUser = async (userId) => {
    setLoading(true);
    try {
      await axios.delete(`/admin/users/${userId}/delete`);
      toast.success('Uspešno ste obrisali korisnika');
      setLoading(false);
      fetchUsers();
    } catch (error) {
      toast.success('Došlo je do greške pri brisanju korisnika');
      console.error(error.response);
      setLoading(false);
    }
  };

  const onPageChange = async (e, { activePage }) => {
    setActivePage(activePage);
    let response = null;
    if (searchTerm) {
      response = await axios.get(`/admin/users?searchTerm=${searchTerm}&pagenum=${activePage - 1}`);
    } else {
      response = await axios.get(`/admin/users?pagenum=${activePage - 1}`);
    }

    setUsers(response.data.content);
  };

  const onChangeSearchTerm = async (term) => {
    const filtered = await axios.get(`/admin/users?searchTerm=${term}`);
    setSearchTerm(term);
    setTotalPages(filtered.data.totalPages);
    setUsers(filtered.data.content);
  };

  const onColumnSort = async (column, direction) => {
    const sortedUsers = await axios.get(
      `/admin/users?sortBy=${column}&searchTerm=${
        searchTerm ? searchTerm : ''
      }&direction=${direction}`,
    );
    setUsers(sortedUsers.data.content);
  };

  return loading ? (
    <CustomLoader />
  ) : (
    users && (
      <div className="usersTable">
        <CustomTable
          tableTitle="Korisnici"
          tableAddItem={'/ips/users/add'}
          tableHeader={userTableHeader}
          content={formatUserData(users)}
          tableSearchHandler={onChangeSearchTerm}
          tableActions={userActionConfig}
          tableActivePage={activePage}
          tableHandlePageChange={onPageChange}
          tableTotalPages={totalPages}
          tableColumnSortHandler={onColumnSort}
          onDeleteHandler={onDeleteUser}
        />
      </div>
    )
  );
};

export default Users;
