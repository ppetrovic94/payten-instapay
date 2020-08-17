package com.payten.instapay.dto.Merchant;

public class MerchantNames {

    private Integer merchantId;
    private String merchantName;

    public MerchantNames(){}

    public MerchantNames(Integer merchantId, String merchantName) {
        this.merchantId = merchantId;
        this.merchantName = merchantName;
    }

    public Integer getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(Integer merchantId) {
        this.merchantId = merchantId;
    }

    public String getMerchantName() {
        return merchantName;
    }

    public void setMerchantName(String merchantName) {
        this.merchantName = merchantName;
    }
}
