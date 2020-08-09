export const feeFormTemplate = {
  feeReceiverId: '',
  merchantId: '',
  feeTypeId: '',
  productTypeId: '',
  condition: '',
  amount: '',
  validityDate: '',
};

export const feeFormConfig = {
  feeReceiver: {
    key: 'feeReceiverId',
    title: 'Po primaocu',
    type: 'DROPDOWN',
    required: false,
  },
  merchant: {
    key: 'merchantId',
    title: 'Trgovac',
    type: 'DROPDOWN',
    options: [],
    required: false,
  },
  feeType: {
    key: 'feeTypeId',
    title: 'Tip provizije',
    type: 'DROPDOWN',
    options: [],
    required: false,
  },
  productType: {
    key: 'productTypeId',
    title: 'Tip proizvoda',
    type: 'DROPDOWN',
    options: [],
    required: false,
  },
  validityDate: { key: 'validityDate', title: 'Validno do', type: 'DATE', required: false },
  condition: { key: 'condition', title: 'Uslov', type: 'NUMBER', required: false },
  amount: { key: 'amount', title: 'Iznos', type: 'NUMBER', required: false },
};

export const getFeeFormConfig = (data) => {
  return {
    ...feeFormConfig,
    feeReceiver: {
      ...feeFormConfig.feeReceiver,
      options: data.feeReceivers.map(({ receiverId, receiverName }) => {
        return {
          value: receiverId,
          text: receiverName,
        };
      }),
    },
    merchant: {
      ...feeFormConfig.merchant,
      options: data.merchantNames.map(({ merchantId, merchantName }) => {
        return {
          value: merchantId,
          text: merchantName,
        };
      }),
    },
    feeType: {
      ...feeFormConfig.feeType,
      options: data.feeTypes.map(({ typeId, typeName }) => {
        return {
          value: typeId,
          text: typeName,
        };
      }),
    },
    productType: {
      ...feeFormConfig.productType,
      options: data.productTypes.map(({ typeId, typeName }) => {
        return {
          value: typeId,
          text: typeName,
        };
      }),
    },
  };
};
