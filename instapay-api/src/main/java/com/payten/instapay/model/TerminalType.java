package com.payten.instapay.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="ACQ_TERMINALS_TYPE")
public class TerminalType {
    @Id
    @Column(name = "TERMINAL_TYPE_ID")
    private Integer terminalTypeId;

    @Column(name = "TERMINAL_TYPE_NAME")
    private String terminalTypeName;

    public Integer getTerminalTypeId() {
        return terminalTypeId;
    }

    public void setTerminalTypeId(Integer terminalTypeId) {
        this.terminalTypeId = terminalTypeId;
    }

    public String getTerminalTypeName() {
        return terminalTypeName;
    }

    public void setTerminalTypeName(String terminalTypeName) {
        this.terminalTypeName = terminalTypeName;
    }

    public TerminalType() {
    }

}
