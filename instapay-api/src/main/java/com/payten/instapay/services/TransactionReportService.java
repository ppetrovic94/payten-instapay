package com.payten.instapay.services;

import com.payten.instapay.model.TransactionReport;
import com.payten.instapay.model.TransactionReportCumulative;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public interface TransactionReportService {
    List<TransactionReport> getMerchantReport(String dateFrom, String dateTo, Integer merchantId);
    List<TransactionReportCumulative> getMerchantReportCumulative(String dateFrom, String dateTo, Integer merchantId);
    void exportIpsReport(String dateFrom, String dateTo, Integer merchantId,String merchantName, HttpServletResponse response) throws IOException;
}
