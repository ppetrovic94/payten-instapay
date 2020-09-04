package com.payten.instapay.dto.Terminal;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;

public class TerminalDto {

    @Size(min = 8, max = 8, message = "Dužina za TID mora biti tačno 8 karaktera")
    private String acquirerTid;

    @NotNull(message = "Morate izabrati trenutni status terminala")
    private Integer statusId;

    private String paymentMethodId;

    @NotEmpty(message = "Morate uneti datum unosa novog terminala")
    private String setupDate;

    @NotNull(message = "Morate uneti tip terminala")
    private Integer terminalTypeId;

    private String terminalAccount;
    private String activationCode;
    private String userId;

    public TerminalDto(){}

    public String getAcquirerTid() {
        return acquirerTid;
    }

    public void setAcquirerTid(String acquirerTid) {
        this.acquirerTid = acquirerTid;
    }

    public Integer getStatusId() {
        return statusId;
    }

    public void setStatusId(Integer statusId) {
        this.statusId = statusId;
    }

    public String getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(String paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public String getTerminalAccount() {
        return terminalAccount;
    }

    public void setTerminalAccount(String terminalAccount) {
        this.terminalAccount = terminalAccount;
    }

    public Date getSetupDate(){
        Date parsedDate = null;
        try {
            java.util.Date formatedDate = new SimpleDateFormat("yyyy-MM-dd").parse(setupDate);
            parsedDate = new Date(formatedDate.getTime());
            return parsedDate;
        } catch(ParseException e){
            e.printStackTrace();
        }
        return parsedDate;
    }

    public void setSetupDate(String setupDate) {
        this.setupDate = setupDate;
    }

    public Integer getTerminalTypeId() {
        return terminalTypeId;
    }

    public void setTerminalTypeId(Integer terminalTypeId) {
        this.terminalTypeId = terminalTypeId;
    }

    public String getActivationCode() {
        return activationCode;
    }

    public void setActivationCode(String activationCode) {
        this.activationCode = activationCode;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
