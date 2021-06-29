export const transactionReportTableHeader = {
  pointOfSaleCode: 'Šifra PM',
  merchantNumber: 'MB Trgovca',
  locationName: 'Naziv lokacije',
  transactionDate: 'Datum transakcije',
  transactionTime: 'Vreme transakcije',
  tid: 'ID naplatnog mesta',
  endToEndId: 'Referenca plaćanja',
  merchantAccount: 'Banka izdavaoc',
  paymentType: 'Vrsta plaćanja',
  productType: 'Vrsta proizvoda',
  amount: 'Iznos',
  feePercentage: 'Procenat provizije (%)',
  feeAmount: 'Iznos provizije (u RSD)',
  netAmount: 'Neto iznos',
  interBankFee: 'Medjubankarska naknada',
  ipsFee: 'Naknada IPS NBS sistema',
};

export const report_json = {
  designFile: 'param_test.rptdesign',
  outputName: 'test_out_1',
  format: 'pdf',
  parameters: {
    paramString: 'String Val',
    paramInteger: 1111,
    paramDate: '2010-05-05',
    paramDecimal: 999.888,
  },
  wrapError: true,
};
