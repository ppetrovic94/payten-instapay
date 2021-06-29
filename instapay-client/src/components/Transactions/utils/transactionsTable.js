export const transactionsTableHeader = {
  endToEndId: 'E2E referenca',
  tid: 'ID terminala',
  status: 'Status',
  statusDate: 'Datum',
  statusCode: 'Status kod',
  instructedAmount: 'Iznos',
  actions: 'Akcije',
};

export const transactionDetailsTableHeader = {
  tid: 'ID terminala',
  status: 'Status',
  endToEndId: 'E2E referenca',
  instructionId: 'ID instrukcije',
  transactionIdentifier: 'Indikator transakcije',
  statusDate: 'Datum statusa',
  setupDate: 'Datum',
};

const transactionIdentifierMapper = {
  100: 'Rezultat naloga',
  101: 'Detalji naloga',
  200: 'Odgovor terminalu',
  300: 'Povratni zahtev',
  400: 'Povratni odgovor',
  502: 'Autorizacija',
};

export const formatTerminalDetails = (data) => {
  return data.map(
    ({ tid, status, endToEndId, instructionId, transactionIdentifier, statusDate, setupDate }) => {
      return {
        tid,
        status,
        endToEndId,
        instructionId,
        transactionIdentifier: transactionIdentifierMapper[transactionIdentifier],
        statusDate,
        setupDate,
      };
    },
  );
};

export const formatTransactionsInstructedAmounts = (data) => {
  return data.map((item) => ({
    ...item,
    instructedAmount: Number(item.instructedAmount).toLocaleString('en', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  }));
};

export const terminalActionConfig = (endToEndId) => {
  return [
    {
      type: 'GET_TRANSACTION_DETAILS',
      name: 'transactionDetails',
      label: 'Detalji transakcije',
      redirectLink: `/ips/terminals/transactions/${endToEndId}`,
      icon: 'list layout',
    },
  ];
};
