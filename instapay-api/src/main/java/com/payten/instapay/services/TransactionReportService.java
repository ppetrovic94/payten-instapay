package com.payten.instapay.services;

import com.payten.instapay.model.TransactionReport;

import java.util.List;

public interface TransactionReportService {
    List<TransactionReport> getMerchantReport(String dateFrom, String dateTo, Integer merchantId);
}
