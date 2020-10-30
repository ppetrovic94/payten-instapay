package com.payten.instapay.model;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name="ACQ_TERMINALS")
@NamedStoredProcedureQuery(name = "Terminal.generateCredentials",
        procedureName = "GENERATE_CREDENTIALS", parameters = {
        @StoredProcedureParameter(mode = ParameterMode.IN, name = "I_TERMINAL_ID", type = Integer.class),
})
public class Terminal {
    @Id
    @Column(name = "TERMINAL_ID")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer terminalId;

    @Basic
    @Column(name = "TERMINAL_SETUP_DATE")
    private Date setupDate;

    @OneToOne
    @JoinColumn(name = "TERMINAL_STATUS")
    private Status status;

    @Column(name = "POINT_OF_SALE_ID")
    private Integer pointOfSaleId;

    @Column(name = "ACQUIRER_TID")
    private String acquirerTid;

    @Column(name = "ACTIVATION_CODE")
    private String activationCode;

    @Column(name = "USER_ID")
    private String userId;

    @Column(name = "DEFAULT_PAYMENT_METHOD")
    private String paymentMethod;

    @Column(name = "TERMINAL_ACCOUNT")
    private String terminalAccount;

    @Column(name = "TERMINAL_TYPE")
    private String terminalType;

    public Terminal() {
    }

    public Integer getTerminalId() {
        return terminalId;
    }

    public void setTerminalId(Integer terminalId) {
        this.terminalId = terminalId;
    }

    public Date getSetupDate() {
        return setupDate;
    }

    public void setSetupDate(Date setupDate) {
        this.setupDate = setupDate;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Integer getPointOfSaleId() {
        return pointOfSaleId;
    }

    public void setPointOfSaleId(Integer pointOfSaleId) {
        this.pointOfSaleId = pointOfSaleId;
    }

    public String getAcquirerTid() {
        return acquirerTid;
    }

    public void setAcquirerTid(String acquirerTid) {
        this.acquirerTid = acquirerTid;
    }

    public String getActivationCode() {
        return activationCode;
    }

    public void setActivationCode(String activationCode) {
        this.activationCode = activationCode;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTerminalAccount() {
        return terminalAccount;
    }

    public void setTerminalAccount(String terminalAccount) {
        this.terminalAccount = terminalAccount;
    }

    public String getTerminalType() {
        return terminalType;
    }

    public void setTerminalType(String terminalType) {
        this.terminalType = terminalType;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}