package com.payten.instapay.dto.Merchant.DataImport;

import com.payten.instapay.model.Merchant;

import java.util.LinkedHashMap;
import java.util.Map;

public class ParsedMerchant {

    private Merchant merchant = new Merchant();
    private Map<String, ParsedPointOfSale> pointOfSaleMap = new LinkedHashMap<String, ParsedPointOfSale>();
    private ImportStatus importStatus = new ImportStatus();

    public ParsedMerchant(){}

    public Map<String, ParsedPointOfSale> getPointOfSaleMap() {
        return pointOfSaleMap;
    }

    public void setPointOfSaleMap(Map<String, ParsedPointOfSale> pointOfSaleMap) {
        this.pointOfSaleMap = pointOfSaleMap;
    }

    public Merchant getMerchant() {
        return merchant;
    }

    public void setMerchant(Merchant merchant) {
        this.merchant = merchant;
    }

    public ImportStatus getImportStatus() {
        return importStatus;
    }

    public void setImportStatus(ImportStatus importStatus) {
        this.importStatus = importStatus;
    }
}
