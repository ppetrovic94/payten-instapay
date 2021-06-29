package com.payten.instapay.controllers;

import com.payten.instapay.model.TransactionReport;
import com.payten.instapay.services.TransactionReportService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(path="/api/acq")
public class ReportController {

    private final TransactionReportService transactionReportService;

    public ReportController(TransactionReportService transactionReportService) {
        this.transactionReportService = transactionReportService;
    }

    @GetMapping("/transactions")
    @ResponseStatus(value = HttpStatus.OK)
    public List<TransactionReport> getMerchantReportJSON(@RequestParam(name="dateFrom", required = true) String dateFrom,
                                                @RequestParam(name="dateTo", required = true) String dateTo,
                                                @RequestParam(name="merchantId", required = true) Integer merchantId){
        return transactionReportService.getMerchantReport(dateFrom, dateTo, merchantId);
    }



    @GetMapping("/exportIpsReport")
    @ResponseStatus(value = HttpStatus.OK)
    public void exportIpsReportToXlsx(@RequestParam(name = "dateFrom") String dateFrom,
                                                                       @RequestParam(name = "dateTo") String dateTo,
                                                                       @RequestParam(name = "merchantId") Integer merchantId,
                                                                       @RequestParam(name = "merchantName") String merchantName,
                                                                       final HttpServletResponse response) throws IOException {

        transactionReportService.exportIpsReport(dateFrom, dateTo, merchantId,merchantName, response);
    }
}
