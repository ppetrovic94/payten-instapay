import React, { useEffect, useState } from 'react';
import axios from '../../../utils/API';
import CustomTable from '../../CustomTable/CustomTable';
import { userTableHeader, formatUserData, userActionConfig } from '../utils/userTable';
import './Users.scss';

const Users = () => {
  const [users, setUsers] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`/admin/users`);
        setUsers(response.data.content);
      } catch (err) {
        setErrors(err.response);
      }
    };
    fetchUsers();
  }, []);

  const onChangeSearchTerm = async (term) => {
    const filtered = await axios.get(`/admin/users?searchTerm=${term}`);
    setUsers(filtered.data.content);
  };

  return (
    <div>
      <div className="usersTable">
        <CustomTable
          tableTitle="Korisnici"
          tableAddItem={'/users/add'}
          tableHeader={userTableHeader}
          content={users && formatUserData(users)}
          tableSearchHandler={onChangeSearchTerm}
          tableActions={userActionConfig}
        />
      </div>
    </div>
  );
};

export default Users;
