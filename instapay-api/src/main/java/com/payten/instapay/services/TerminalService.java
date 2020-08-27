package com.payten.instapay.services;

import com.payten.instapay.dto.Terminal.TerminalDto;
import com.payten.instapay.dto.Terminal.TerminalMetadata;
import com.payten.instapay.model.Terminal;
import org.springframework.data.domain.Page;
import org.springframework.validation.BindingResult;

public interface TerminalService {
    Page<Terminal> findAllTerminalsPaginated(Integer pointOfSaleId, int pageNum, String searchTerm, String sortBy, String direction);
    Terminal addTerminal(Integer pointOfSaleId, TerminalDto terminalDto, BindingResult result);
    TerminalDto findById(Integer terminalId);
    TerminalMetadata getTerminalMetadata();
    Terminal updateTerminal(Integer terminalId, TerminalDto terminalDto, BindingResult result);
    void deleteTerminal(Integer terminalId);
    void generateCredentials(Integer terminalId);
}
