package com.payten.instapay.model.custom;

import java.util.ArrayList;
import java.util.List;

public class TerminalTransactionPage {

    List<TerminalTransaction> content = new ArrayList<>();
    Integer totalElements;
    Integer totalPages;

    public TerminalTransactionPage() {
    }

    public List<TerminalTransaction> getContent() {
        return content;
    }

    public void setContent(List<TerminalTransaction> content) {
        this.content = content;
    }

    public Integer getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(Integer totalElements) {
        this.totalElements = totalElements;
    }


    public Integer getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(Integer totalPages) {
        this.totalPages = totalPages;
    }
}
