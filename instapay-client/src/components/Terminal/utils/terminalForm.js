export const terminalFormTemplate = {
  acquirerTid: '',
  statusId: 200,
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
  },
  paymentMethod: {
    key: 'paymentMethodId',
    title: 'Metod plaćanja',
    type: 'DROPDOWN',
    options: [],
    required: true,
  },
  terminalType: {
    key: 'terminalTypeId',
    title: 'Tip terminala',
    type: 'DROPDOWN',
    options: [],
    required: true,
  },
  setupDate: { key: 'setupDate', title: 'Datum postavljanja', type: 'DATE', required: true },

  terminalAccount: {
    key: 'terminalAccount',
    title: 'Broj računa',
    type: 'NUMBER',
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
