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

export const cityActionConfig = () => {
  return [
    {
      type: 'DELETE',
      name: 'deleteCity',
      label: 'Ukloni',
      icon: 'trash',
    },
  ];
};
