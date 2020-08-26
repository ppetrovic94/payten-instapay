export const cityTableHeader = {
  cityName: 'Naziv',
  cityCode: 'Poštanski broj',
  actions: 'Akcije',
};

export const formatCitiesData = (data) => {
  return data.map(({ cityId, cityName, cityCode }) => {
    return {
      cityId,
      cityName,
      cityCode,
    };
  });
};

export const cityActionConfig = (id) => {
  return [
    {
      type: 'UPDATE',
      name: 'updateCity',
      label: 'Izmeni',
      redirectLink: `/cities/${id}`,
      icon: 'edit',
    },
    {
      type: 'DELETE',
      name: 'deleteCity',
      label: 'Ukloni',
      redirectLink: '',
      icon: 'trash',
    },
  ];
};
