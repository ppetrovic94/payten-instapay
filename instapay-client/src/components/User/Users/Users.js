import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import CustomTable from '../../CustomTable/CustomTable';
import { userTableHeader, formatUserData, userActionConfig } from '../utils/userTable';
import './Users.scss';

const Users = () => {
  const [users, setUsers] = useState(null);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/admin/users`);
        setUsers(response.data.content);
      } catch (err) {
        setErrors(err.response);
      }
    };
    fetchUsers();
  }, []);

  const onChangeSearchTerm = async (term) => {
    const filtered = await axios.get(`http://localhost:8080/admin/users?searchTerm=${term}`);
    setUsers(filtered.data.content);
  };

  return (
    <div>
      <Button as={Link} to={'/groups'}>
        Grupe uloga
      </Button>
      <h2 className="usersTitle">Korisnici</h2>
      <div className="usersTable">
        <CustomTable
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
