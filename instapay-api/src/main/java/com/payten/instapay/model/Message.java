package com.payten.instapay.model;

import java.sql.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="MESSAGES")
//@Table(name="CO_RESULT")
public class Message {

    @Id
    @Column(name="MESSAGE_IDENTIFICATION")
    private String messageIdentification;

    @Column(name="CREATION_DATE_TIME")
    private Date creationDateTime;

    @Column(name="IDENTIFICATION")
    private String identification;

    @Column(name="NOTIFICATION_DATE_TIME")
    private Date notificationDateTime;

    @Column(name="CREDITOR_ACCOUNT")
    private String creditorAccount;

    @Column(name="CREDITOR_NAME")
    private String creditorName;

    @Column(name="AMOUNT")
    private Double amount;

    @Column(name="CREDIT_INDICATOR")
    private String creditIndicator;

    @Column(name="ENTRY_TYPE")
    private String entryType;

    @Column(name="NOTIFICATION_TYPE")
    private String notificationType;

    @Column(name="NOTIFICATION_FAMILY")
    private String notificationFamily;

    @Column(name="NOTIFICATION_SUBFAMILY")
    private String notificationSubfamily;

    @Column(name="PROPRIETARY_NOTIFICATION_CODE")
    private String proprietaryNotificationCode;

    @Column(name="ISSUER")
    private String issuer;

    @Column(name="MESSAGE_IDENTIFICATION_PACS")
    private String messageIdentificationPacs;

    @Column(name="INSTRUCTION_IDENTIFICATION")
    private String instructionIdentification;

    @Column(name="END_TO_END_IDENTIFICATION")
    private String endToEndIdentification;

    @Column(name="TRANSACTION_IDENTIFICATION")
    private String transactionIdentification;

    @Column(name="TRANSACTION_AMOUNT")
    private Double transactionAmount;

    @Column(name="CREDIT_INDICATOR_2")
    private String creditIndicator2;

    @Column(name="PAYER_NAME")
    private String payerName;

    @Column(name="PAYER_ALIAS")
    private String payerAlias;

    @Column(name="PAYEE_NAME")
    private String payeeName;

    @Column(name="PAYEE_ALIAS")
    private String payeeAlias;

    @Column(name="UNSTRUCTURED")
    private String unstructured;

    @Column(name="STRUCTURED")
    private String structured;

    @Column(name="APPROVAL_CODE")
    private String approvalCode;

    @Column(name="RRN")
    private String rrn;

    @Column(name="TID")
    private String tid;

    @Column(name="TERMINAL_SEQUENCE")
    private String terminalSequence;

    @Column(name="TERMINAL_INVOICE")
    private String terminalInvoice;

    @Column(name="STATUS")
    private String status;

    public Message() {
    }

    public String getMessageIdentification() {
        return messageIdentification;
    }

    public void setMessageIdentification(String messageIdentification) {
        this.messageIdentification = messageIdentification;
    }

    public Date getCreationDateTime() {
        return creationDateTime;
    }

    public void setCreationDateTime(Date creationDateTime) {
        this.creationDateTime = creationDateTime;
    }

    public String getIdentification() {
        return identification;
    }

    public void setIdentification(String identification) {
        this.identification = identification;
    }

    public Date getNotificationDateTime() {
        return notificationDateTime;
    }

    public void setNotificationDateTime(Date notificationDateTime) {
        this.notificationDateTime = notificationDateTime;
    }

    public String getCreditorAccount() {
        return creditorAccount;
    }

    public void setCreditorAccount(String creditorAccount) {
        this.creditorAccount = creditorAccount;
    }

    public String getCreditorName() {
        return creditorName;
    }

    public void setCreditorName(String creditorName) {
        this.creditorName = creditorName;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getCreditIndicator() {
        return creditIndicator;
    }

    public void setCreditIndicator(String creditIndicator) {
        this.creditIndicator = creditIndicator;
    }

    public String getEntryType() {
        return entryType;
    }

    public void setEntryType(String entryType) {
        this.entryType = entryType;
    }

    public String getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(String notificationType) {
        this.notificationType = notificationType;
    }

    public String getNotificationFamily() {
        return notificationFamily;
    }

    public void setNotificationFamily(String notificationFamily) {
        this.notificationFamily = notificationFamily;
    }

    public String getNotificationSubfamily() {
        return notificationSubfamily;
    }

    public void setNotificationSubfamily(String notificationSubfamily) {
        this.notificationSubfamily = notificationSubfamily;
    }

    public String getProprietaryNotificationCode() {
        return proprietaryNotificationCode;
    }

    public void setProprietaryNotificationCode(String proprietaryNotificationCode) {
        this.proprietaryNotificationCode = proprietaryNotificationCode;
    }

    public String getIssuer() {
        return issuer;
    }

    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }

    public String getMessageIdentificationPacs() {
        return messageIdentificationPacs;
    }

    public void setMessageIdentificationPacs(String messageIdentificationPacs) {
        this.messageIdentificationPacs = messageIdentificationPacs;
    }

    public String getInstructionIdentification() {
        return instructionIdentification;
    }

    public void setInstructionIdentification(String instructionIdentification) {
        this.instructionIdentification = instructionIdentification;
    }

    public String getEndToEndIdentification() {
        return endToEndIdentification;
    }

    public void setEndToEndIdentification(String endToEndIdentification) {
        this.endToEndIdentification = endToEndIdentification;
    }

    public String getTransactionIdentification() {
        return transactionIdentification;
    }

    public void setTransactionIdentification(String transactionIdentification) {
        this.transactionIdentification = transactionIdentification;
    }

    public Double getTransactionAmount() {
        return transactionAmount;
    }

    public void setTransactionAmount(Double transactionAmount) {
        this.transactionAmount = transactionAmount;
    }

    public String getCreditIndicator2() {
        return creditIndicator2;
    }

    public void setCreditIndicator2(String creditIndicator2) {
        this.creditIndicator2 = creditIndicator2;
    }

    public String getPayerName() {
        return payerName;
    }

    public void setPayerName(String payerName) {
        this.payerName = payerName;
    }

    public String getPayerAlias() {
        return payerAlias;
    }

    public void setPayerAlias(String payerAlias) {
        this.payerAlias = payerAlias;
    }

    public String getPayeeName() {
        return payeeName;
    }

    public void setPayeeName(String payeeName) {
        this.payeeName = payeeName;
    }

    public String getPayeeAlias() {
        return payeeAlias;
    }

    public void setPayeeAlias(String payeeAlias) {
        this.payeeAlias = payeeAlias;
    }

    public String getUnstructured() {
        return unstructured;
    }

    public void setUnstructured(String unstructured) {
        this.unstructured = unstructured;
    }

    public String getStructured() {
        return structured;
    }

    public void setStructured(String structured) {
        this.structured = structured;
    }

    public String getApprovalCode() {
        return approvalCode;
    }

    public void setApprovalCode(String approvalCode) {
        this.approvalCode = approvalCode;
    }

    public String getRrn() {
        return rrn;
    }

    public void setRrn(String rrn) {
        this.rrn = rrn;
    }

    public String getTid() {
        return tid;
    }

    public void setTid(String tid) {
        this.tid = tid;
    }

    public String getTerminalSequence() {
        return terminalSequence;
    }

    public void setTerminalSequence(String terminalSequence) {
        this.terminalSequence = terminalSequence;
    }

    public String getTerminalInvoice() {
        return terminalInvoice;
    }

    public void setTerminalInvoice(String terminalInvoice) {
        this.terminalInvoice = terminalInvoice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}
