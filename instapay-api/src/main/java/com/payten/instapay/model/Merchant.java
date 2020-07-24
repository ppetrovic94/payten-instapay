package com.payten.instapay.model;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Date;

@Entity
@Table(name = "ACQ_MERCHANTS")
public class Merchant implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MERCHANT_ID")
    private Integer merchantId;

    @Column(name = "MERCHANT_NAME")
    private String merchantName;

    @Column(name = "MERCHANT_ADDRESS")
    private String merchantAddress;

    @Basic
    @Column(name = "MERCHANT_SETUP_DATE")
    private Date setupDate;

    @OneToOne
    @JoinColumn(name = "DEFAULT_PAYMENT_METHOD")
    private PaymentMethod paymentMethod;

    @Column(name = "MCC")
    private Integer mcc;

    @Column(name = "MERCHANT_ACCOUNT")
    private String merchantAccount;

    @Column(name = "TAX_IDENTITY_NUMBER")
    private String taxIdentityNumber;

    @Column(name = "PERSONAL_IDENTITY_NUMBER")
    private String personalIdentityNumber;

    @Column(name = "RETURN_ENABLED")
    private Integer returnEnabled;

    @Column(name = "LOCAL_MERCHANT_ID")
    private String localMerchantId;

    @Column(name = "PAYMENT_CODE")
    private String paymentCode;

    @Column(name = "ERECEIPT_ENABLED")
    private Integer ereceiptEnabled;

    @Column(name = "SERVICE_AMOUNT_LIMIT")
    private BigDecimal serviceAmountLimit;

    @OneToOne
    @JoinColumn(name = "MERCHANT_STATUS")
    private AcqStatus status;

    @OneToOne
    @JoinColumn(name = "MERCHANT_CITY_ID")
    private City city;

    public Merchant() {
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

    public City getCity() {
        return city;
    }

    public void setCity(City city) {
        this.city = city;
    }

    public Date getSetupDate() {
        return setupDate;
    }

    public void setSetupDate(Date setupDate) {
        this.setupDate = setupDate;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
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

    public AcqStatus getStatus() {
        return status;
    }

    public void setStatus(AcqStatus status) {
        this.status = status;
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

    public String getLocalMerchantId() {
        return localMerchantId;
    }

    public void setLocalMerchantId(String localMerchantId) {
        this.localMerchantId = localMerchantId;
    }

    public String getPaymentCode() {
        return paymentCode;
    }

    public void setPaymentCode(String paymentCode) {
        this.paymentCode = paymentCode;
    }

    public Integer getEreceiptEnabled() {
        return ereceiptEnabled;
    }

    public void setEreceiptEnabled(Integer ereceiptEnabled) {
        this.ereceiptEnabled = ereceiptEnabled;
    }

    public BigDecimal getServiceAmountLimit() {
        return serviceAmountLimit;
    }

    public void setServiceAmountLimit(BigDecimal serviceAmountLimit) {
        this.serviceAmountLimit = serviceAmountLimit;
    }

    public Integer getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(Integer merchantId) {
        this.merchantId = merchantId;
    }
}