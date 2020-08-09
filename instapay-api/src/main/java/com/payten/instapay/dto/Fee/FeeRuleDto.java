package com.payten.instapay.dto.Fee;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;

public class FeeRuleDto {

    private Integer merchantId;
    private Integer feeTypeId;
    private Integer feeReceiverId;
    private Integer productTypeId;
    private Integer condition;
    private Float amount;
    private String validityDate;

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

    public Date getValidityDate(){
        Date parsedDate = null;
        try {
            java.util.Date formatedDate = new SimpleDateFormat("yyyy-MM-dd").parse(validityDate);
            parsedDate = new Date(formatedDate.getTime());
            return parsedDate;
        } catch(ParseException e){
            e.printStackTrace();
        }
        return parsedDate;
    }

    public void setValidityDate(String validityDate) {
        this.validityDate = validityDate;
    }

    public Integer getCondition() {
        return condition;
    }

    public void setCondition(Integer condition) {
        this.condition = condition;
    }
}
