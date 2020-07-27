export const userTableHeader = {
  fullName: 'Ime',
  username: 'Korisničko ime (username)',
  email: 'Elektronska pošta (email)',
  isApproved: 'Aktivan',
  groups: 'Grupe',
  actions: 'Akcije',
};

export const formatUserData = (data) => {
  return data.map(({ userId, username, email, isApproved, fullName, groups }) => {
    return {
      userId,
      username,
      email,
      isApproved: isApproved === 1 ? 'Da' : 'Ne',
      fullName,
      groups: extractGroupNames(groups),
    };
  });
};

const extractGroupNames = (groups) => {
  const groupNames = [];
  groups.forEach((group) => groupNames.push(group.groupName));
  return groupNames;
};

export const userActionConfig = (id) => {
  return [
    {
      type: 'UPDATE',
      name: 'updateUser',
      label: 'Izmeni',
      redirectLink: `/users/${id}`,
      icon: 'edit',
    },
    {
      type: 'DELETE',
      name: 'deleteUser',
      label: 'Ukloni',
      redirectLink: '',
      icon: 'trash',
    },
  ];
};
