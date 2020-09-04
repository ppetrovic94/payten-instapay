package com.payten.instapay.dto.Merchant;

import com.payten.instapay.model.Status;
import com.payten.instapay.model.City;
import com.payten.instapay.model.PaymentMethod;

import java.util.List;

public class MerchantMetadata {

    private List<PaymentMethod> paymentMethods;
    private List<Status> statuses;
    private List<City> cities;

    public MerchantMetadata(){}

    public List<PaymentMethod> getPaymentMethods() {
        return paymentMethods;
    }

    public void setPaymentMethods(List<PaymentMethod> paymentMethods) {
        this.paymentMethods = paymentMethods;
    }

    public List<Status> getStatuses() {
        return statuses;
    }

    public void setStatuses(List<Status> statuses) {
        this.statuses = statuses;
    }

    public List<City> getCities() {
        return cities;
    }

    public void setCities(List<City> cities) {
        this.cities = cities;
    }
}
