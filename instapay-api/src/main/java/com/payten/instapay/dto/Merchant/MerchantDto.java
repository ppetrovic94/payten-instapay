package com.payten.instapay.dto.Merchant;

import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;

public class MerchantDto {

    private String localMerchantId;

    @NotEmpty(message = "Morate uneti ime trgovca")
    private String merchantName;

    @NotEmpty(message = "Morate uneti adresu trgovca")
    private String merchantAddress;

    @Email(message = "Email nije u odgovarajućem formatu")
    private String merchantEmail;

    @NotEmpty(message = "Morate uneti datum unosa novog trgovca")
    private String setupDate;

    @NotEmpty(message = "Morate izabrati metod plaćanja trgovca")
    private String paymentMethodId;

    @Size(min = 0, max = 3, message = "Dužina za kod plaćanja trgovca mora biti tačno 3 karaktera")
    private String paymentCode;

    @NotNull(message = "Morate izabrati trenutni status trgovca")
    private Integer statusId;

    @NotNull(message = "Morate uneti MCC kod trgovca")
    private Integer mcc;

    @NotEmpty(message = "Morate uneti broj računa trgovca")
    private String merchantAccount;

    @NotNull(message = "Morate uneti grad trgovca")
    private Integer cityId;

    private String taxIdentityNumber;
    private String personalIdentityNumber;
    private Integer returnEnabled;
    private Integer ereceiptEnabled;
    private BigDecimal serviceAmountLimit;


    public String getLocalMerchantId() {
        return localMerchantId;
    }

    public void setLocalMerchantId(String localMerchantId) {
        this.localMerchantId = localMerchantId;
    }

    public String getMerchantName() {
        return merchantName;
    }

    public void setMerchantName(String merchantName) {
        this.merchantName = merchantName;
    }

    public String getMerchantAddress() {
        return merchantAddress;
    }

    public void setMerchantAddress(String merchantAddress) {
        this.merchantAddress = merchantAddress;
    }

    public String getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(String paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public Integer getMcc() {
        return mcc;
    }

    public void setMcc(Integer mcc) {
        this.mcc = mcc;
    }

    public String getMerchantAccount() {
        return merchantAccount;
    }

    public void setMerchantAccount(String merchantAccount) {
        this.merchantAccount = merchantAccount;
    }

    public String getTaxIdentityNumber() {
        return taxIdentityNumber;
    }

    public void setTaxIdentityNumber(String taxIdentityNumber) {
        this.taxIdentityNumber = taxIdentityNumber;
    }

    public String getPersonalIdentityNumber() {
        return personalIdentityNumber;
    }

    public void setPersonalIdentityNumber(String personalIdentityNumber) {
        this.personalIdentityNumber = personalIdentityNumber;
    }

    public Integer getReturnEnabled() {
        return returnEnabled;
    }

    public void setReturnEnabled(Integer returnEnabled) {
        this.returnEnabled = returnEnabled;
    }

    public Integer getStatusId() {
        return statusId;
    }

    public void setStatusId(Integer statusId) {
        this.statusId = statusId;
    }


    public String getPaymentCode() {
        return paymentCode;
    }

    public void setPaymentCode(String paymentCode) {
        this.paymentCode = paymentCode;
    }

    public BigDecimal getServiceAmountLimit() {
        return serviceAmountLimit;
    }

    public void setServiceAmountLimit(BigDecimal serviceAmountLimit) {
        this.serviceAmountLimit = serviceAmountLimit;
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

    public Integer getCityId() {
        return cityId;
    }

    public void setCityId(Integer cityId) {
        this.cityId = cityId;
    }

    public Integer getEreceiptEnabled() {
        return ereceiptEnabled;
    }

    public void setEreceiptEnabled(Integer ereceiptEnabled) {
        this.ereceiptEnabled = ereceiptEnabled;
    }

    public String getMerchantEmail() {
        return merchantEmail;
    }

    public void setMerchantEmail(String merchantEmail) {
        this.merchantEmail = merchantEmail;
    }
}
