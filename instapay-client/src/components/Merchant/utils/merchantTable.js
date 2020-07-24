export const merchantTableHeader = {
  localMerchantId: 'ID Trgovca',
  merchantName: 'Naziv trgovca',
  merchantAddress: 'Adresa',
  city: 'Grad',
  status: 'Status',
  setupDate: 'Datum postavljanja',
  personalIdentityNumber: 'Matični broj',
  paymentMethod: 'Metod plaćanja',
  actions: 'Akcije',
};

export const formatMerchantData = (data) => {
  return data.map(
    ({
      merchantId,
      localMerchantId,
      merchantName,
      merchantAddress,
      city,
      status,
      setupDate,
      personalIdentityNumber,
      paymentMethod,
    }) => {
      return {
        merchantId,
        localMerchantId,
        merchantName,
        merchantAddress,
        city: city ? city.cityName : '',
        status: status ? status.statusName : '',
        setupDate,
        personalIdentityNumber,
        paymentMethod: paymentMethod ? paymentMethod.paymentMethodName : '',
      };
    },
  );
};

export const merchantActionConfig = (id) => {
  return [
    {
      type: 'UPDATE',
      name: 'editMerchant',
      label: 'Izmeni',
      redirectLink: `/merchant/${id}`,
      icon: '',
    },
    {
      type: 'GET',
      name: 'getPointOfSales',
      label: 'Prodajna mesta',
      redirectLink: `/merchant/${id}/pos`,
      icon: '',
    },
  ];
};
