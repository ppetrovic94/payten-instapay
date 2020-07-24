export const pointOfSaleFormTemplate = {
  pointOfSaleLocalId: '',
  pointOfSaleName: '',
  pointOfSaleAddress: '',
  cityId: '',
  statusId: 200,
  setupDate: '',
  pointOfSaleMCC: '',
  pointOfSaleAccount: '',
  paymentMethodId: '',
};

export const pointOfSaleFormConfig = {
  pointOfSaleLocalId: {
    key: 'pointOfSaleLocalId',
    title: 'ID prodajnog mesta',
    type: 'TEXT',
    required: false,
  },
  pointOfSaleName: {
    key: 'pointOfSaleName',
    title: 'Naziv prodajnog mesta',
    type: 'TEXT',
    required: true,
  },
  pointOfSaleAddress: { key: 'pointOfSaleAddress', title: 'Adresa', type: 'TEXT', required: true },
  city: {
    key: 'cityId',
    title: 'Grad',
    type: 'DROPDOWN',
    options: [],
    required: false,
  },
  status: {
    key: 'statusId',
    title: 'Status',
    type: 'DROPDOWN',
    options: [],
    required: false,
  },
  setupDate: { key: 'setupDate', title: 'Datum postavljanja', type: 'DATE', required: true },
  pointOfSaleMcc: { key: 'pointOfSaleMcc', title: 'MCC', type: 'NUMBER', required: false },
  pointOfSaleAccount: {
    key: 'pointOfSaleAccount',
    title: 'Broj računa',
    type: 'NUMBER',
    required: true,
  },
  paymentMethod: {
    key: 'paymentMethodId',
    title: 'Metod plaćanja',
    type: 'DROPDOWN',
    options: [],
    required: true,
  },
};

export const getPointOfSaleFormConfig = (data) => {
  return {
    ...pointOfSaleFormConfig,
    city: {
      ...pointOfSaleFormConfig.city,
      options: data.cities.map(({ cityId, cityName }) => {
        return {
          value: cityId,
          text: cityName,
        };
      }),
    },
    paymentMethod: {
      ...pointOfSaleFormConfig.paymentMethod,
      options: data.paymentMethods.map(({ paymentMethodId, paymentMethodName }) => {
        return {
          value: paymentMethodId,
          text: paymentMethodName,
        };
      }),
    },
    status: {
      ...pointOfSaleFormConfig.status,
      options: data.statuses.map(({ statusId, statusName }) => {
        return {
          value: statusId,
          text: statusName,
        };
      }),
    },
  };
};
