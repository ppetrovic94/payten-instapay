export const feeTableHeader = {
  feeReceiver: 'Po primaocu',
  merchant: 'Trgovac',
  feeType: 'Tip provizije',
  productType: 'On/Off us',
  condition: 'Uslov',
  amount: 'Iznos',
  validityDate: 'Validno do',
  actions: 'Akcije',
};

export const formatFeeData = (data) => {
  return data.map(
    ({ feeId, feeReceiver, merchant, feeType, productType, condition, amount, validityDate }) => {
      return {
        feeId,
        feeReceiver: feeReceiver ? feeReceiver.receiverName : '',
        merchant: merchant ? merchant.merchantName : '',
        feeType: feeType ? feeType.typeName : '',
        productType: productType ? productType.typeName : '',
        condition,
        amount: feeType.typeName == 'Procentualni' ? `${amount}%` : amount,
        validityDate,
      };
    },
  );
};

export const feeActionConfig = (id) => {
  return [
    {
      type: 'UPDATE',
      name: 'editFee',
      label: 'Izmeni',
      redirectLink: `/fees/${id}`,
      icon: 'edit',
    },
    {
      type: 'DELETE',
      name: 'deleteFee',
      label: 'Ukloni',
      redirectLink: ``,
      icon: 'trash',
    },
  ];
};
