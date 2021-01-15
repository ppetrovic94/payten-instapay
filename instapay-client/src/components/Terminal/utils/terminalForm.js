export const terminalFormTemplate = {
  acquirerTid: '',
  terminalTypeId: '',
  statusId: null,
  paymentMethodId: '',
  setupDate: '',
  terminalAccount: '',
};

export const terminalFormConfig = {
  acquirerTid: {
    key: 'acquirerTid',
    title: 'TID',
    type: 'TEXT',
    required: true,
  },
  terminalType: {
    key: 'terminalTypeId',
    title: 'Tip terminala',
    type: 'DROPDOWN',
    options: [],
    required: true,
    disabled: false,
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
    required: false,
    disabled: false,
  },

  setupDate: { key: 'setupDate', title: 'Datum postavljanja', type: 'DATE', required: true },

  terminalAccount: {
    key: 'terminalAccount',
    title: 'Broj računa',
    type: 'TEXT',
    required: false,
  },
};

export const getTerminalFormConfig = (data) => {
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
      options: data.statuses.map(({ statusId, statusName }) => {
        return {
          value: statusId,
          text: statusName,
        };
      }),
    },
  };
};
