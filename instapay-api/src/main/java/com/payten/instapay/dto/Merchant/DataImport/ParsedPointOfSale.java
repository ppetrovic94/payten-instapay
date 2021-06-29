package com.payten.instapay.dto.Merchant.DataImport;

import com.payten.instapay.model.PointOfSale;

import java.util.LinkedHashMap;
import java.util.Map;

public class ParsedPointOfSale {

    private PointOfSale pointOfSale = new PointOfSale();
    private Map<String, ParsedTerminal> terminalMap = new LinkedHashMap<String, ParsedTerminal>();
    private ImportStatus importStatus = new ImportStatus();

    public ParsedPointOfSale(){}


    public PointOfSale getPointOfSale() {
        return pointOfSale;
    }

    public void setPointOfSale(PointOfSale pointOfSale) {
        this.pointOfSale = pointOfSale;
    }

    public ImportStatus getImportStatus() {
        return importStatus;
    }

    public void setImportStatus(ImportStatus importStatus) {
        this.importStatus = importStatus;
    }

    public Map<String, ParsedTerminal> getTerminalMap() {
        return terminalMap;
    }

    public void setTerminalMap(Map<String, ParsedTerminal> terminalMap) {
        this.terminalMap = terminalMap;
    }
}
