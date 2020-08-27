export const pointOfSaleTableHeader = {
  pointOfSaleLocalId: 'ID prodajnog Mesta',
  pointOfSaleName: 'Naziv prodajnog mesta',
  pointOfSaleAddress: 'Adresa',
  city: 'Grad',
  status: 'Status',
  setupDate: 'Datum postavljanja',
  pointOfSaleAccount: 'Broj računa',
  paymentMethod: 'Metod plaćanja',
  actions: 'Akcije',
};

export const formatPointOfSalesData = (data) => {
  return data.map(
    ({
      pointOfSaleId,
      pointOfSaleLocalId,
      pointOfSaleName,
      pointOfSaleAddress,
      city,
      status,
      setupDate,
      pointOfSaleAccount,
      paymentMethod,
      merchantId,
    }) => {
      return {
        pointOfSaleId,
        merchantId,
        pointOfSaleLocalId,
        pointOfSaleName,
        pointOfSaleAddress,
        city: city ? city.cityName : '',
        status: status ? status.statusName : '',
        setupDate,
        pointOfSaleAccount,
        paymentMethod: paymentMethod ? paymentMethod.paymentMethodName : '',
      };
    },
  );
};

export const pointOfSaleActionConfig = (id) => {
  return [
    {
      type: 'UPDATE',
      name: 'editPointOfSale',
      label: 'Izmeni',
      redirectLink: `/pos/${id}`,
      icon: 'edit',
    },
    {
      type: 'GET',
      name: 'getTerminals',
      label: 'Terminali',
      redirectLink: `/pos/${id}/terminals`,
      icon: 'calculator',
    },
  ];
};
