package com.payten.instapay.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name="O_CUR")
public class TransactionReportCumulative implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name="PM_CODE")
    private String  pointOfSaleCode;
    @Id
    @Column(name="POINT_OF_SALE_NAME")
    private String locationName;
    @Id
    @Column(name="PAYMENT_TYPE")
    private String paymentType;
    @Id
    @Column(name="PRODUCT_TYPE")
    private String productType;

    @Column(name="FEE_PERCENTAGE", columnDefinition="Decimal(22,2)" )
    private Double fee_percentage;

    @Column(name="FEE_AMOUNT", columnDefinition="Decimal(22,2)")
    private double fee_amount;

    @Column(name="TRN_COUNT")
    private Integer trnCount;

    @Column(name="TRN_AMOUNT_SUM", columnDefinition="Decimal(22,2)")
    private double trnSum;

    @Column(name="INTER_BANK_FEE", columnDefinition="Decimal(22,2)")
    private double interBankFee;

    @Column(name="IPS_FEE", columnDefinition="Decimal(22,2)")
    private double ipsFee;

    public TransactionReportCumulative() {
    }

    public String getPointOfSaleCode() {
        return pointOfSaleCode;
    }

    public void setPointOfSaleCode(String pointOfSaleCode) {
        this.pointOfSaleCode = pointOfSaleCode;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
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

    public Integer getTrnCount() {
        return trnCount;
    }

    public void setTrnCount(Integer trnCount) {
        this.trnCount = trnCount;
    }

    public double getTrnSum() {
        return trnSum;
    }

    public void setTrnSum(double trnSum) {
        this.trnSum = trnSum;
    }

    public double getInterBankFee() {
        return interBankFee;
    }

    public void setInterBankFee(double interBankFee) {
        this.interBankFee = interBankFee;
    }

    public double getIpsFee() {
        return ipsFee;
    }

    public void setIpsFee(double ipsFee) {
        this.ipsFee = ipsFee;
    }

    public Double getFee_percentage() {
        return fee_percentage;
    }

    public void setFee_percentage(Double fee_percentage) {
        this.fee_percentage = fee_percentage;
    }

    public Double getFee_amount() {
        return fee_amount;
    }

    public void setFee_amount(Double fee_amount) {
        this.fee_amount = fee_amount;
    }


}
