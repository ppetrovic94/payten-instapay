export const groupFormTemplate = {
  groupName: '',
  description: '',
  roleIds: [],
};

export const groupFormConfig = {
  groupName: {
    key: 'groupName',
    title: 'Naziv',
    type: 'TEXT',
    required: true,
  },
  description: {
    key: 'description',
    title: 'Opis',
    type: 'TEXT',
    required: false,
  },
  roleIds: {
    key: 'roleIds',
    title: 'Uloge',
    type: 'CHECKBOX',
    options: [],
    required: false,
  },
};
