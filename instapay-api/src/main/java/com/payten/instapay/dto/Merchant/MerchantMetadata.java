package com.payten.instapay.dto.Merchant;

import com.payten.instapay.model.AcqStatus;
import com.payten.instapay.model.City;
import com.payten.instapay.model.PaymentMethod;

import java.util.List;

public class MerchantMetadata {

    private List<PaymentMethod> paymentMethods;
    private List<AcqStatus> statuses;
    private List<City> cities;

    public MerchantMetadata(){}

    public List<PaymentMethod> getPaymentMethods() {
        return paymentMethods;
    }

    public void setPaymentMethods(List<PaymentMethod> paymentMethods) {
        this.paymentMethods = paymentMethods;
    }

    public List<AcqStatus> getStatuses() {
        return statuses;
    }

    public void setStatuses(List<AcqStatus> statuses) {
        this.statuses = statuses;
    }

    public List<City> getCities() {
        return cities;
    }

    public void setCities(List<City> cities) {
        this.cities = cities;
    }
}
