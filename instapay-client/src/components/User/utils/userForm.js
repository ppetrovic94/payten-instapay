export const userFormTemplate = {
  fullName: '',
  username: '',
  password: '',
  email: '',
  isApproved: '',
  groupIds: [],
};

export const userFormConfig = {
  fullName: {
    key: 'fullName',
    title: 'Ime i prezime',
    type: 'TEXT',
    required: true,
  },
  username: {
    key: 'username',
    title: 'Korisničko ime (username)',
    type: 'TEXT',
    required: true,
  },
  password: {
    key: 'password',
    title: 'Lozinka',
    type: 'PASSWORD',
    required: true,
  },
  email: {
    key: 'email',
    title: 'Elektronska pošta (email)',
    type: 'TEXT',
    required: false,
  },
  isApproved: {
    key: 'isApproved',
    title: 'Aktivan',
    type: 'DROPDOWN',
    options: [
      { value: 1, text: 'Da' },
      { value: 0, text: 'Ne' },
    ],
    required: false,
  },
  groupIds: {
    key: 'groupIds',
    title: 'Grupe',
    type: 'CHECKBOX',
    options: [],
    required: false,
  },
};
