package com.payten.instapay.dto.Terminal;

import com.payten.instapay.model.Status;
import com.payten.instapay.model.PaymentMethod;
import com.payten.instapay.model.TerminalType;

import java.util.List;

public class TerminalMetadata {

    private List<PaymentMethod> paymentMethods;
    private List<Status> statuses;
    private List<TerminalType> terminalTypes;

    public TerminalMetadata(){}

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


    public List<TerminalType> getTerminalTypes() {
        return terminalTypes;
    }

    public void setTerminalTypes(List<TerminalType> terminalTypes) {
        this.terminalTypes = terminalTypes;
    }
}
