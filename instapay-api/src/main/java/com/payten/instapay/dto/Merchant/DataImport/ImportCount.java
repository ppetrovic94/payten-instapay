package com.payten.instapay.dto.Merchant.DataImport;

public class ImportCount {
    private int merchantCount;
    private int pointOfSaleCount;
    private int terminalCount;

    public ImportCount(){}


    public int getTerminalCount() {
        return terminalCount;
    }

    public void setTerminalCount(int terminalCount) {
        this.terminalCount = terminalCount;
    }

    public int getPointOfSaleCount() {
        return pointOfSaleCount;
    }

    public void setPointOfSaleCount(int pointOfSaleCount) {
        this.pointOfSaleCount = pointOfSaleCount;
    }

    public int getMerchantCount() {
        return merchantCount;
    }

    public void setMerchantCount(int merchantCount) {
        this.merchantCount = merchantCount;
    }
}
