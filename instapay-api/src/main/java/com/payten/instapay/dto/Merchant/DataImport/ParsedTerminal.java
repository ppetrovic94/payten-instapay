package com.payten.instapay.dto.Merchant.DataImport;

import com.payten.instapay.model.Terminal;

public class ParsedTerminal {

    private Terminal terminal = new Terminal();
    private ImportStatus importStatus = new ImportStatus();

    public ParsedTerminal(){}

    public ImportStatus getImportStatus() {
        return importStatus;
    }

    public void setImportStatus(ImportStatus importStatus) {
        this.importStatus = importStatus;
    }

    public Terminal getTerminal() {
        return terminal;
    }

    public void setTerminal(Terminal terminal) {
        this.terminal = terminal;
    }
}
