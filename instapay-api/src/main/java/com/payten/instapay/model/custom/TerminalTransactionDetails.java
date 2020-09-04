package com.payten.instapay.model.custom;

import java.sql.Timestamp;

public class TerminalTransactionDetails {

    private String endToEndId;

    private String tid;

    private String transactionIdentifier;

    private String status;

    private String statusDate;

    private Timestamp setupDate;

    private String instructionId;

    public TerminalTransactionDetails() {
    }

    public String getEndToEndId() {
        return endToEndId;
    }

    public void setEndToEndId(String endToEndId) {
        this.endToEndId = endToEndId;
    }

    public String getTid() {
        return tid;
    }

    public void setTid(String tid) {
        this.tid = tid;
    }

    public String getTransactionIdentifier() {
        return transactionIdentifier;
    }

    public void setTransactionIdentifier(String transactionIdentifier) {
        this.transactionIdentifier = transactionIdentifier;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusDate() {
        return statusDate;
    }

    public void setStatusDate(String statusDate) {
        this.statusDate = statusDate;
    }

    public String getInstructionId() {
        return instructionId;
    }

    public void setInstructionId(String instructionId) {
        this.instructionId = instructionId;
    }

    public Timestamp getSetupDate() {
        return setupDate;
    }

    public void setSetupDate(Timestamp setupDate) {
        this.setupDate = setupDate;
    }
}
