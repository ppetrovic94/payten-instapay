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

export const groupActionConfig = (id) => {
  return [
    {
      type: 'UPDATE',
      name: 'updateGroup',
      label: 'Izmeni',
      redirectLink: `/groups/${id}`,
      icon: 'edit',
    },
    {
      type: 'DELETE',
      name: 'deleteGroup',
      label: 'Ukloni',
      redirectLink: '',
      icon: 'trash',
    },
  ];
};
