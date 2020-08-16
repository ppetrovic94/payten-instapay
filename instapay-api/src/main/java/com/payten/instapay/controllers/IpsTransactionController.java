package com.payten.instapay.controllers;


import com.payten.instapay.model.Merchant;
import com.payten.instapay.model.TransactionReport;
import com.payten.instapay.services.TransactionReportService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path="/acq",produces = "application/json")
@CrossOrigin(origins="*")
public class IpsTransactionController {

    private final TransactionReportService transactionReportService;

    public IpsTransactionController(TransactionReportService transactionReportService) {
        this.transactionReportService = transactionReportService;
    }

    @GetMapping("/transactions")
    @ResponseStatus(value = HttpStatus.OK)
    public List<TransactionReport> getMerchants(@RequestParam(name="dateFrom", required = true) String dateFrom,
                                                @RequestParam(name="dateTo", required = true) String dateTo,
                                                @RequestParam(name="merchantId", required = true) Integer merchantId){
        return transactionReportService.getMerchantReport(dateFrom, dateTo, merchantId);
    }

}
