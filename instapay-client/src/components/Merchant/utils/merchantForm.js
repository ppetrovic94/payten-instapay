export const merchantFormTemplate = {
  localMerchantId: '',
  merchantName: '',
  personalIdentityNumber: '',
  taxIdentityNumber: '',
  merchantAddress: '',
  cityId: '',
  statusId: 200,
  setupDate: '',
  mcc: '',
  merchantAccount: '',
  paymentMethodId: '',
  returnEnabled: '',
  paymentCode: '',
  ereceiptEnabled: '',
  serviceAmountLimit: '',
};

export const merchantFormConfig = {
  localMerchantId: { key: 'localMerchantId', title: 'ID Trgovca', type: 'TEXT', required: false },
  merchantName: { key: 'merchantName', title: 'Naziv trgovca', type: 'TEXT', required: true },
  personalIdentityNumber: {
    key: 'personalIdentityNumber',
    title: 'Matični broj',
    type: 'TEXT',
    required: false,
  },
  taxIdentityNumber: { key: 'taxIdentityNumber', title: 'PIB', type: 'TEXT', required: false },
  merchantAddress: { key: 'merchantAddress', title: 'Adresa', type: 'TEXT', required: true },
  city: {
    key: 'cityId',
    title: 'Grad',
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
    required: false,
    disabled: false,
  },
  setupDate: { key: 'setupDate', title: 'Datum postavljanja', type: 'DATE', required: true },
  mcc: { key: 'mcc', title: 'MCC', type: 'NUMBER', required: true },
  merchantAccount: { key: 'merchantAccount', title: 'Broj računa', type: 'NUMBER', required: true },
  paymentMethod: {
    key: 'paymentMethodId',
    title: 'Metod plaćanja',
    type: 'DROPDOWN',
    options: [],
    required: true,
    disabled: false,
  },
  returnEnabled: {
    key: 'returnEnabled',
    title: 'Omogućen povraćaj',
    type: 'DROPDOWN',
    options: [
      { value: 1, text: 'Da' },
      { value: 0, text: 'Ne' },
    ],
    required: false,
    disabled: false,
  },
  paymentCode: { key: 'paymentCode', title: 'Kod plaćanja', type: 'NUMBER', required: false },
  ereceiptEnabled: {
    key: 'ereceiptEnabled',
    title: 'Omogućen e-receipt',
    type: 'DROPDOWN',
    options: [
      { value: 1, text: 'Da' },
      { value: 0, text: 'Ne' },
    ],
    required: false,
    disabled: false,
  },
  serviceAmountLimit: {
    key: 'serviceAmountLimit',
    title: 'Iznos limita',
    type: 'NUMBER',
    required: false,
  },
};

export const getFormConfig = (data) => {
  return {
    ...merchantFormConfig,
    city: {
      ...merchantFormConfig.city,
      options: data.cities.map(({ cityId, cityName }) => {
        return {
          value: cityId,
          text: cityName,
        };
      }),
    },
    paymentMethod: {
      ...merchantFormConfig.paymentMethod,
      options: data.paymentMethods.map(({ paymentMethodId, paymentMethodName }) => {
        return {
          value: paymentMethodId,
          text: paymentMethodName,
        };
      }),
    },
    status: {
      ...merchantFormConfig.status,
      options: data.statuses.map(({ statusId, statusName }) => {
        return {
          value: statusId,
          text: statusName,
        };
      }),
    },
  };
};
