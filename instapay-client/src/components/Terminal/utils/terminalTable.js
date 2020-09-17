export const terminalTableHeader = {
  acquirerTid: 'TID',
  status: 'Status',
  setupDate: 'Datum postavljanja',
  terminalAccount: 'Broj računa',
  paymentMethod: 'Metod plaćanja',
  terminalType: 'Tip terminala',
  actions: 'Akcije',
};

export const terminalTableKeys = Object.keys(terminalTableHeader);

export const terminalTableValues = Object.values(terminalTableHeader);

export const formatTerminalData = (data) => {
  return data.map(
    ({
      terminalId,
      acquirerTid,
      status,
      terminalAccount,
      terminalType,
      setupDate,
      paymentMethod,
    }) => {
      return {
        terminalId,
        acquirerTid,
        status: status ? status.statusName : '',
        terminalAccount,
        terminalType,
        setupDate,
        paymentMethod:
          paymentMethod === 'P' ? 'Present' : paymentMethod === 'S' ? 'Scan' : paymentMethod === '',
      };
    },
  );
};

export const terminalActionConfig = (id) => {
  return [
    {
      type: 'UPDATE',
      name: 'editTerminal',
      label: 'Izmeni',
      redirectLink: `/ips/terminals/${id}`,
      icon: 'edit',
    },
    {
      type: 'GET_TRANSACTIONS',
      name: 'transactions',
      label: 'Transakcije',
      redirectLink: `/ips/terminals/${id}/transactions`,
      icon: 'exchange',
    },
    {
      type: 'GET_ANDROID_DETAILS',
      name: 'androidDetails',
      label: 'Kredencijali za ANDROID',
      redirectLink: `/ips/terminals/${id}/details`,
      icon: 'android',
    },
  ];
};
