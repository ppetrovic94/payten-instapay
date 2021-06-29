package com.payten.instapay.dto.Merchant.DataImport;

import java.util.*;

public class ValidatedMerchantSet {

    private Set<ParsedMerchant> parsedMerchantSet;
    private Set<String> validationMapList = new HashSet<>();

    public ValidatedMerchantSet() {
    }

    public Set<ParsedMerchant> getParsedMerchantSet() {
        return parsedMerchantSet;
    }

    public void setParsedMerchantSet(Set<ParsedMerchant> parsedMerchantSet) {
        this.parsedMerchantSet = parsedMerchantSet;
    }


    public Set<String> getValidationMapList() {
        return validationMapList;
    }

    public void setValidationMapList(Set<String> validationMapList) {
        this.validationMapList = validationMapList;
    }
}
