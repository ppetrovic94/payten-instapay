package com.payten.instapay.controllers;


import com.payten.instapay.dto.Merchant.DataImport.ImportResult;
import com.payten.instapay.dto.Merchant.DataImport.ParsedMerchant;
import com.payten.instapay.model.PaymentMethod;
import com.payten.instapay.services.DataImportService;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping(path="/api/user",produces = "application/json")
public class DataImportController {

    private final DataImportService dataImportService;

    public DataImportController(DataImportService dataImportService) {
        this.dataImportService = dataImportService;
    }

    @PostMapping("/parsexlsx")
    public Set<ParsedMerchant> parseXlsx(@RequestParam("fileName") MultipartFile fileName) throws IOException, InvalidFormatException {
        return dataImportService.parseDataFromXlsx(fileName);
    }

    @PostMapping("/bulkinsert")
    public ImportResult bulkInsert(@RequestBody Set<ParsedMerchant> parsedMerchants, @RequestParam("paymentMethod") String paymentMethodId) {
        return dataImportService.bulkImport(parsedMerchants, paymentMethodId);
    }

    @GetMapping("/paymentmethods")
    public List<PaymentMethod> getPaymentMethods(){
        return dataImportService.getPaymentMethods();
    }

}
