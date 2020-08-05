package com.payten.instapay.dto.Fee;

import javax.validation.constraints.NotNull;
import java.sql.Date;

public class FeeRuleDto {

    private Integer merchantId;
    private Integer feeTypeId;
    private Integer feeReceiverId;
    private Integer productTypeId;

    @NotNull(message = "Morate uneti iznos provizije")
    private Float amount;

    private Date validityDate;

    public FeeRuleDto() {}

    public Integer getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(Integer merchantId) {
        this.merchantId = merchantId;
    }

    public Integer getFeeTypeId() {
        return feeTypeId;
    }

    public void setFeeTypeId(Integer feeTypeId) {
        this.feeTypeId = feeTypeId;
    }

    public Integer getFeeReceiverId() {
        return feeReceiverId;
    }

    public void setFeeReceiverId(Integer feeReceiverId) {
        this.feeReceiverId = feeReceiverId;
    }

    public Integer getProductTypeId() {
        return productTypeId;
    }

    public void setProductTypeId(Integer productTypeId) {
        this.productTypeId = productTypeId;
    }

    public Float getAmount() {
        return amount;
    }

    public void setAmount(Float amount) {
        this.amount = amount;
    }

    public Date getValidityDate() {
        return validityDate;
    }

    public void setValidityDate(Date validityDate) {
        this.validityDate = validityDate;
    }
}
