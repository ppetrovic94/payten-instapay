import axios from 'axios';

export const terminalFormTemplate = {
  acquirerTid: '',
  statusId: 100,
  paymentMethodId: '',
  setupDate: '',
  terminalTypeId: '',
  terminalAccount: '',
};

export const terminalFormConfig = {
  acquirerTid: {
    key: 'acquirerTid',
    title: 'TID',
    type: 'TEXT',
    required: false,
  },
  status: {
    key: 'statusId',
    title: 'Status',
    type: 'DROPDOWN',
    options: [],
    required: true,
    disabled: false,
  },
  paymentMethod: {
    key: 'paymentMethodId',
    title: 'Metod plaćanja',
    type: 'DROPDOWN',
    options: [],
    required: true,
    disabled: false,
  },
  terminalType: {
    key: 'terminalTypeId',
    title: 'Tip terminala',
    type: 'DROPDOWN',
    options: [],
    required: true,
    disabled: false,
  },
  setupDate: { key: 'setupDate', title: 'Datum postavljanja', type: 'DATE', required: true },

  terminalAccount: {
    key: 'terminalAccount',
    title: 'Broj računa',
    type: 'NUMBER',
    required: false,
  },
};

export const generateCredentials = async (id) => {
  try {
    await axios.get(`http://localhost:8080/user/terminals/${id}/generateCredentials`);
  } catch (err) {
    console.error(err.response);
  }
};

export const getTerminalFormConfig = (data, isNew) => {
  return {
    ...terminalFormConfig,
    terminalType: {
      ...terminalFormConfig.terminalType,
      options: data.terminalTypes.map(({ terminalTypeId, terminalTypeName }) => {
        return {
          value: terminalTypeId,
          text: terminalTypeName,
        };
      }),
    },
    paymentMethod: {
      ...terminalFormConfig.paymentMethod,
      options: data.paymentMethods.map(({ paymentMethodId, paymentMethodName }) => {
        return {
          value: paymentMethodId,
          text: paymentMethodName,
        };
      }),
    },
    status: {
      ...terminalFormConfig.status,
      disabled: isNew,
      options: data.statuses.map(({ statusId, statusName }) => {
        return {
          value: statusId,
          text: statusName,
        };
      }),
    },
  };
};
