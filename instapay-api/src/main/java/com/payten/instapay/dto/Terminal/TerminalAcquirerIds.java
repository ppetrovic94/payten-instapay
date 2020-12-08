package com.payten.instapay.dto.Terminal;

public class TerminalAcquirerIds {

    private Integer terminalId;
    private String acquirerId;

    public TerminalAcquirerIds() {}

    public TerminalAcquirerIds(Integer terminalId, String acquirerId) {
        this.terminalId = terminalId;
        this.acquirerId = acquirerId;
    }

    public Integer getTerminalId() {
        return terminalId;
    }

    public void setTerminalId(Integer terminalId) {
        this.terminalId = terminalId;
    }

    public String getAcquirerId() {
        return acquirerId;
    }

    public void setAcquirerId(String acquirerId) {
        this.acquirerId = acquirerId;
    }
}
