package com.payten.instapay.model;

import javax.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "PAYMENT_REQUESTS_SERBIA")
public class PaymentRequest {

    @Id
    @Column(name = "END_TO_END_ID", unique = true)
    private String endToEndId;

    @Column(name = "TRANSACTION_IDENTIFIER")
    private String transactionIdentifier;

    @Column(name = "TID")
    private String tid;

    @Column(name = "STATUS")
    private String status;

    @Column(name = "ORIGINATED")
    private String originated;

    @Column(name = "DIRECTION")
    private String direction;

    @Column(name = "AUTHORISATION_SYSTEM")
    private String authorizationSystem;

    @Column(name = "TRANSFER_ID")
    private String transferId;

    @Column(name = "INSTRUCTING_AGENT")
    private String instructingAgent;

    @Column(name = "CREDITOR_ACCOUNT")
    private String creditorAccount;

    @Column(name = "DEBTOR_ACCOUNT")
    private String debtorAccount;

    @Column(name = "INSTRUCTED_CODE")
    private String instructedCode;

    @Column(name = "CREDITOR_NAME")
    private String creditorName;

    @Column(name = "CREDITOR_ADDRESS_LINE")
    private String creditorAddressLine;

    @Column(name = "CREDITOR_ADDRESS_LOCALITY")
    private String creditorAddressLocality;

    @Column(name = "CREDITOR_ADDRESS_COUNTRY")
    private String creditorAddressCountry;

    @Column(name = "DEBTOR_NAME")
    private String debtorName;

    @Column(name = "DEBTOR_ADDRESS_LINE")
    private String debtorAddressLine;

    @Column(name = "DEBTOR_ADDRESS_COUNTRY")
    private String debtorAddressCountry;

    @Column(name = "PAYMENT_DESCRIPTION")
    private String paymentDescription;

    @Column(name = "PURPOSE_CODE")
    private Integer purposeCode;

    @Column(name = "URGENCY")
    private String urgency;

    @Column(name = "INSTRUMENT_CODE")
    private String instrumentCode;

    @Column(name = "MCC")
    private String mcc;

    @Column(name = "CREDITOR_REFERENCE")
    private String creditorReference;

    @Column(name = "CREDITOR_REFERENCE_MODEL")
    private String creditorReferenceModel;

    @Column(name = "CHARGE")
    private String charge;

    @Column(name = "VALUE_DATE")
    private String valueDate;

    @Column(name = "SYNC_TIMESTAMP")
    private String syncTimestamp;

    @Column(name = "APPROVAL_CODE")
    private String approvalCode;

    @Column(name = "RRN")
    private String rrn;

    @Column(name = "TERMINAL_SEQUENCE")
    private String terminalSequence;

    @Column(name = "TERMINAL_INVOICE")
    private String terminalInvoice;

    @Column(name = "MTI")
    private String mti;

    @Column(name = "PROCESSING_CODE")
    private String processingCode;

    @Column(name = "STATUS_DATE")
    private String statusDate;

    @Column(name = "INSTRUCTION_ID")
    private String instructionId;

    @Column(name = "INSTRUCTED_AMOUNT")
    private Integer instructedAmount;

    @Column(name = "DATUM")
    private Date datum;

    @Column(name = "STATUS_CODE")
    private String statusCode;

    public String getOriginated() {
        return originated;
    }

    public void setOriginated(String originated) {
        this.originated = originated;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getAuthorizationSystem() {
        return authorizationSystem;
    }

    public void setAuthorizationSystem(String authorizationSystem) {
        this.authorizationSystem = authorizationSystem;
    }

    public String getTransferId() {
        return transferId;
    }

    public void setTransferId(String transferId) {
        this.transferId = transferId;
    }

    public String getInstructingAgent() {
        return instructingAgent;
    }

    public void setInstructingAgent(String instructingAgent) {
        this.instructingAgent = instructingAgent;
    }

    public String getCreditorAccount() {
        return creditorAccount;
    }

    public void setCreditorAccount(String creditorAccount) {
        this.creditorAccount = creditorAccount;
    }

    public String getDebtorAccount() {
        return debtorAccount;
    }

    public void setDebtorAccount(String debtorAccount) {
        this.debtorAccount = debtorAccount;
    }

    public String getInstructedCode() {
        return instructedCode;
    }

    public void setInstructedCode(String instructedCode) {
        this.instructedCode = instructedCode;
    }

    public String getCreditorName() {
        return creditorName;
    }

    public void setCreditorName(String creditorName) {
        this.creditorName = creditorName;
    }

    public String getCreditorAddressLine() {
        return creditorAddressLine;
    }

    public void setCreditorAddressLine(String creditorAddressLine) {
        this.creditorAddressLine = creditorAddressLine;
    }

    public String getCreditorAddressLocality() {
        return creditorAddressLocality;
    }

    public void setCreditorAddressLocality(String creditorAddressLocality) {
        this.creditorAddressLocality = creditorAddressLocality;
    }

    public String getCreditorAddressCountry() {
        return creditorAddressCountry;
    }

    public void setCreditorAddressCountry(String creditorAddressCountry) {
        this.creditorAddressCountry = creditorAddressCountry;
    }

    public String getDebtorName() {
        return debtorName;
    }

    public void setDebtorName(String debtorName) {
        this.debtorName = debtorName;
    }

    public String getDebtorAddressLine() {
        return debtorAddressLine;
    }

    public void setDebtorAddressLine(String debtorAddressLine) {
        this.debtorAddressLine = debtorAddressLine;
    }

    public String getDebtorAddressCountry() {
        return debtorAddressCountry;
    }

    public void setDebtorAddressCountry(String debtorAddressCountry) {
        this.debtorAddressCountry = debtorAddressCountry;
    }

    public String getPaymentDescription() {
        return paymentDescription;
    }

    public void setPaymentDescription(String paymentDescription) {
        this.paymentDescription = paymentDescription;
    }

    public Integer getPurposeCode() {
        return purposeCode;
    }

    public void setPurposeCode(Integer purposeCode) {
        this.purposeCode = purposeCode;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public String getInstrumentCode() {
        return instrumentCode;
    }

    public void setInstrumentCode(String instrumentCode) {
        this.instrumentCode = instrumentCode;
    }

    public String getMcc() {
        return mcc;
    }

    public void setMcc(String mcc) {
        this.mcc = mcc;
    }

    public String getCreditorReference() {
        return creditorReference;
    }

    public void setCreditorReference(String creditorReference) {
        this.creditorReference = creditorReference;
    }

    public String getCreditorReferenceModel() {
        return creditorReferenceModel;
    }

    public void setCreditorReferenceModel(String creditorReferenceModel) {
        this.creditorReferenceModel = creditorReferenceModel;
    }

    public String getCharge() {
        return charge;
    }

    public void setCharge(String charge) {
        this.charge = charge;
    }

    public String getValueDate() {
        return valueDate;
    }

    public void setValueDate(String valueDate) {
        this.valueDate = valueDate;
    }

    public String getSyncTimestamp() {
        return syncTimestamp;
    }

    public void setSyncTimestamp(String syncTimestamp) {
        this.syncTimestamp = syncTimestamp;
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

    public String getMti() {
        return mti;
    }

    public void setMti(String mti) {
        this.mti = mti;
    }

    public String getProcessingCode() {
        return processingCode;
    }

    public void setProcessingCode(String processingCode) {
        this.processingCode = processingCode;
    }

    public String getEndToEndId() {
        return endToEndId;
    }

    public void setEndToEndId(String endToEndId) {
        this.endToEndId = endToEndId;
    }

    public String getTransactionIdentifier() {
        return transactionIdentifier;
    }

    public void setTransactionIdentifier(String transactionIdentifier) {
        this.transactionIdentifier = transactionIdentifier;
    }

    public String getTid() {
        return tid;
    }

    public void setTid(String tid) {
        this.tid = tid;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusDate() {
        return statusDate;
    }

    public void setStatusDate(String statusDate) {
        this.statusDate = statusDate;
    }

    public String getInstructionId() {
        return instructionId;
    }

    public void setInstructionId(String instructionId) {
        this.instructionId = instructionId;
    }

    public Integer getInstructedAmount() {
        return instructedAmount;
    }

    public void setInstructedAmount(Integer instructedAmount) {
        this.instructedAmount = instructedAmount;
    }

    public Date getDatum() {
        return datum;
    }

    public void setDatum(Date datum) {
        this.datum = datum;
    }

    public String getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(String statusCode) {
        this.statusCode = statusCode;
    }
}
