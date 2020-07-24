export const groupTableHeader = {
  groupName: 'Ime grupe',
  description: 'Opis',
  roles: 'Uloge',
  actions: 'Akcije',
};

export const formatGroupData = (data) => {
  return data.map(({ groupName, description, roles }) => {
    return {
      groupName,
      description,
      roles: roles.map(({ roleName }) => roleName),
    };
  });
};
