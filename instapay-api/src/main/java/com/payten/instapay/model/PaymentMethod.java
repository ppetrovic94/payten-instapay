package com.payten.instapay.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="ACQ_PAYMENT_METHODS")
public class PaymentMethod {

    @Id
    @Column(name="PAYMENT_METHOD_ID")
    private String paymentMethodId;

    @Column(name="PAYMENT_METHOD_NAME")
    private String paymentMethodName;

    public PaymentMethod() {
    }

    public String getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(String paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public String getPaymentMethodName() {
        return paymentMethodName;
    }

    public void setPaymentMethodName(String paymentMethodName) {
        this.paymentMethodName = paymentMethodName;
    }


}
