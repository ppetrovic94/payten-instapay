package com.payten.instapay.dto.Merchant.DataImport;

import java.util.Set;

public class ImportResult {

    private Set<ParsedMerchant> parsedMerchantList;
    private ImportCount importCount = new ImportCount();

    public ImportResult(){}

    public ImportCount getImportCount() {
        return importCount;
    }

    public void setImportCount(ImportCount importCount) {
        this.importCount = importCount;
    }


    public Set<ParsedMerchant> getParsedMerchantList() {
        return parsedMerchantList;
    }

    public void setParsedMerchantList(Set<ParsedMerchant> parsedMerchantList) {
        this.parsedMerchantList = parsedMerchantList;
    }
}
