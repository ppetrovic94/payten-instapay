package com.payten.instapay.model.custom;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Entity
public class TerminalTransaction {

    @Id
    @Column(name = "END_TO_END_ID")
    private String endToEndId;

    @Column(name = "TID")
    private String tid;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "STATUS_DATE")
    private String statusDate;

    @Column(name = "STATUS_CODE")
    private String statusCode;

    @Column(name = "INSTRUCTED_AMOUNT")
    private Float instructedAmount;

    public TerminalTransaction() {
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(String statusCode) {
        this.statusCode = statusCode;
    }

    public Float getInstructedAmount() {
        return instructedAmount;
    }

    public void setInstructedAmount(Float instructedAmount) {
        this.instructedAmount = instructedAmount;
    }

    public String getStatusDate() {
        return statusDate;
    }

    public void setStatusDate(String statusDate) {
        this.statusDate = statusDate;
    }
}
