package com.payten.instapay.services;

import com.payten.instapay.dto.Merchant.DataImport.ImportResult;
import com.payten.instapay.dto.Merchant.DataImport.ParsedMerchant;
import com.payten.instapay.model.PaymentMethod;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

public interface DataImportService {

    Set<ParsedMerchant> parseDataFromXlsx(MultipartFile xlsxFile) throws IOException, InvalidFormatException;

    ImportResult bulkImport(Set<ParsedMerchant> parsedMerchants, String paymentMethodId);

    List<PaymentMethod> getPaymentMethods();
}
