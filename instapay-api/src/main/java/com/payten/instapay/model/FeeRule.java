package com.payten.instapay.model;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "REG_FEE_RULES")
public class FeeRule {

    @Id
    @Column(name = "FEE_ID")
    private Integer feeId;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.REFRESH})
    @JoinColumn(name = "MERCHANT_ID", nullable = true)
    private Merchant merchant;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST,
            CascadeType.REFRESH})
    @JoinColumn(name = "FEE_TYPE")
    private FeeType feeType;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST,
            CascadeType.REFRESH})
    @JoinColumn(name = "FEE_RECEIVER_ID")
    private FeeReceiver feeReceiver;

    @Column(name = "FEE_CONDITION")
    private Integer condition;

    @Column(name = "FEE_AMOUNT")
    private Float amount;

    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST,
            CascadeType.REFRESH})
    @JoinColumn(name = "PRODUCT_TYPE_ID")
    private ProductType productType;

    @Column(name = "VALIDITY_DATE", nullable = true)
    private Date validityDate;

    public FeeRule() {
    }

    public Integer getFeeId() {
        return feeId;
    }

    public void setFeeId(Integer feeId) {
        this.feeId = feeId;
    }

    public Merchant getMerchant() {
        return merchant;
    }

    public void setMerchant(Merchant merchant) {
        this.merchant = merchant;
    }

    public FeeType getFeeType() {
        return feeType;
    }

    public void setFeeType(FeeType feeType) {
        this.feeType = feeType;
    }

    public FeeReceiver getFeeReceiver() {
        return feeReceiver;
    }

    public void setFeeReceiver(FeeReceiver feeReceiver) {
        this.feeReceiver = feeReceiver;
    }

    public Integer getCondition() {
        return condition;
    }

    public void setCondition(Integer condition) {
        this.condition = condition;
    }

    public Float getAmount() {
        return amount;
    }

    public void setAmount(Float amount) {
        this.amount = amount;
    }

    public ProductType getProductType() {
        return productType;
    }

    public void setProductType(ProductType productType) {
        this.productType = productType;
    }

    public Date getValidityDate() {
        return validityDate;
    }

    public void setValidityDate(Date validityDate) {
        this.validityDate = validityDate;
    }
}
