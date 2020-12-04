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
      acqUser,
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
        acqUser,
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
      redirectLink: `/ips/merchant/${id}`,
      icon: 'edit',
    },
    {
      type: 'GET',
      name: 'getPointOfSales',
      label: 'Prodajna mesta',
      redirectLink: `/ips/merchant/${id}/pos`,
      icon: 'warehouse',
    },
    {
      type: 'GET',
      name: 'getFees',
      label: 'Provizije',
      redirectLink: `/ips/merchant/${id}/fees`,
      icon: 'file powerpoint',
    },
    {
      type: 'GET',
      name: 'merchantCredentials',
      label: 'Kredencijali',
      redirectLink: `/ips/merchant/${id}/credentials`,
      icon: 'qrcode',
    },
  ];
};
