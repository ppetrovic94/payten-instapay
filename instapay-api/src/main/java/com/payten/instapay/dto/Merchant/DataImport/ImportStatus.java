package com.payten.instapay.dto.Merchant.DataImport;

public class ImportStatus {

    private boolean imported;

    private String message;

    private int messageCode;

    public ImportStatus(){}

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isImported() {
        return imported;
    }

    public void setImported(boolean imported) {
        this.imported = imported;
    }

    public int getMessageCode() {
        return messageCode;
    }

    public void setMessageCode(int messageCode) {
        this.messageCode = messageCode;
    }
}
