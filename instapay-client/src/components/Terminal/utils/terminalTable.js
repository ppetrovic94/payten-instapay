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
          paymentMethod === 'P' ? 'Present' : paymentMethod === 'S' ? 'Scan' : paymentMethod,
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
      redirectLink: `/terminals/${id}`,
      icon: 'edit',
    },
    {
      type: 'ANDROID_DETAILS',
      name: 'androidDetails',
      label: 'Kredencijali za ANDROID',
      redirectLink: `/terminals/${id}/details`,
      icon: 'android',
    },
  ];
};
