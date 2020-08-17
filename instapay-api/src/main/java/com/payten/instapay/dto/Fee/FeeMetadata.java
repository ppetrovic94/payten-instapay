package com.payten.instapay.dto.Fee;

import com.payten.instapay.dto.Merchant.MerchantNames;
import com.payten.instapay.model.FeeReceiver;
import com.payten.instapay.model.FeeType;
import com.payten.instapay.model.ProductType;

import java.util.List;

public class FeeMetadata {

    List<FeeType> feeTypes;
    List<FeeReceiver> feeReceivers;
    List<ProductType> productTypes;
    List<MerchantNames> merchantNames;

    public FeeMetadata() {}

    public List<FeeType> getFeeTypes() {
        return feeTypes;
    }

    public void setFeeTypes(List<FeeType> feeTypes) {
        this.feeTypes = feeTypes;
    }

    public List<FeeReceiver> getFeeReceivers() {
        return feeReceivers;
    }

    public void setFeeReceivers(List<FeeReceiver> feeReceivers) {
        this.feeReceivers = feeReceivers;
    }

    public List<ProductType> getProductTypes() {
        return productTypes;
    }

    public void setProductTypes(List<ProductType> productTypes) {
        this.productTypes = productTypes;
    }

    public List<MerchantNames> getMerchantNames() {
        return merchantNames;
    }

    public void setMerchantNames(List<MerchantNames> merchantNames) {
        this.merchantNames = merchantNames;
    }
}
