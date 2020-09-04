package com.payten.instapay.services;

import com.payten.instapay.model.custom.TerminalTransactionDetails;
import com.payten.instapay.model.custom.TerminalTransactionPage;

import java.util.List;

public interface TransactionService {
     TerminalTransactionPage getTransactionByTerminalIdAndDateRangePaginated(String dateFrom, String dateTo, String terminalId, Integer pageNum, Integer pageSize);
     List<TerminalTransactionDetails> getTransactionDetailsByEndToEndId(String endToEndId);
}
