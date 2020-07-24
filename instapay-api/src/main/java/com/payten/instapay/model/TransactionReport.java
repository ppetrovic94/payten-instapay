package com.payten.instapay.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="O_CUR")
public class TransactionReport {
    @Id
    @Column(name = "END_TO_END_ID")
    private String endToEndId;

    @Column(name = "PM_CODE")
    private String pointOfSaleCode;

    @Column(name = "TAX_IDENTITY_NUMBER")
    private String merchantNumber;

    @Column(name = "POINT_OF_SALE_NAME")
    private String locationName;

    @Column(name = "TRANSACTION_DATE")
    private String transactionDate;

    @Column(name = "TRANSACTION_TIME")
    private String transactionTime;

    @Column(name = "ACQUIRER_TID")
    private String tid;

    @Column(name = "BANK_CODE")
    private String merchantAccount;

    @Column(name = "PAYMENT_TYPE")
    private String paymentType;

    @Column(name = "PRODUCT_TYPE")
    private String productType;

    @Column(name = "INSTRUCTED_AMOUNT", columnDefinition = "Decimal(22,2)")
    private double amount;

    @Column(name = "FEE_PERCENTAGE", columnDefinition = "Decimal(10,2)")
    private Double feePercentage;

    @Column(name = "FEE_AMOUNT", columnDefinition = "Decimal(10,2)")
    private Double feeAmount;

    @Column(name = "NET_AMOUNT", columnDefinition = "Decimal(22,2)")
    private double netAmount;

    @Column(name = "INTER_BANK_FEE", columnDefinition = "Decimal(22,2)")
    private Double interBankFee;

    @Column(name = "IPS_FEE", columnDefinition = "Decimal(22,2)")
    private Double ipsFee;

    public TransactionReport() {
    }

    public String getEndToEndId() {
        return endToEndId;
    }

    public void setEndToEndId(String endToEndId) {
        this.endToEndId = endToEndId;
    }

    public String getPointOfSaleCode() {
        return pointOfSaleCode;
    }

    public void setPointOfSaleCode(String pointOfSaleCode) {
        this.pointOfSaleCode = pointOfSaleCode;
    }

    public String getMerchantNumber() {
        return merchantNumber;
    }

    public void setMerchantNumber(String merchantNumber) {
        this.merchantNumber = merchantNumber;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(String transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getTransactionTime() {
        return transactionTime;
    }

    public void setTransactionTime(String transactionTime) {
        this.transactionTime = transactionTime;
    }

    public String getTid() {
        return tid;
    }

    public void setTid(String tid) {
        this.tid = tid;
    }

    public String getMerchantAccount() {
        return merchantAccount;
    }

    public void setMerchantAccount(String merchantAccount) {
        this.merchantAccount = merchantAccount;
    }

    public String getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(String paymentType) {
        this.paymentType = paymentType;
    }

    public String getProductType() {
        return productType;
    }

    public void setProductType(String productType) {
        this.productType = productType;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Double getFeePercentage() {
        return feePercentage;
    }

    public void setFeePercentage(Double feePercentage) {
        this.feePercentage = feePercentage;
    }

    public Double getFeeAmount() {
        return feeAmount;
    }

    public void setFeeAmount(Double feeAmount) {
        this.feeAmount = feeAmount;
    }

    public double getNetAmount() {
        return netAmount;
    }

    public void setNetAmount(double netAmount) {
        this.netAmount = netAmount;
    }

    public Double getInterBankFee() {
        return interBankFee;
    }

    public void setInterBankFee(Double interBankFee) {
        this.interBankFee = interBankFee;
    }

    public Double getIpsFee() {
        return ipsFee;
    }

    public void setIpsFee(Double ipsFee) {
        this.ipsFee = ipsFee;
    }
}
