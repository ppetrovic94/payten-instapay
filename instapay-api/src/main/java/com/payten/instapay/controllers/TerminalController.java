package com.payten.instapay.controllers;

import com.payten.instapay.dto.Terminal.TerminalDto;
import com.payten.instapay.dto.Terminal.TerminalMetadata;
import com.payten.instapay.model.Terminal;
import com.payten.instapay.services.TerminalService;
import com.payten.instapay.utils.ZXingHelper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.io.OutputStream;

@RestController
@RequestMapping(path="/api/user",produces = "application/json")
public class TerminalController {

    private final TerminalService terminalService;

    public TerminalController(TerminalService terminalService) {
        this.terminalService = terminalService;
    }

    @GetMapping("/pos/{pointOfSaleId}/terminals")
    @ResponseStatus(value = HttpStatus.OK)
    public Page<Terminal> getPosTerminals(@PathVariable Integer pointOfSaleId,
                                          @RequestParam(name="pagenum",required = false, defaultValue = "0") int pageNumber,
                                          @RequestParam(name="searchTerm", required = false, defaultValue="") String searchTerm,
                                          @RequestParam(name ="sortBy", required = false, defaultValue = "") String sortBy,
                                          @RequestParam(name = "direction", required = false, defaultValue = "ASC") String direction){
        return terminalService.findAllTerminalsPaginated(pointOfSaleId, pageNumber, searchTerm, sortBy, direction);
    }

    @PostMapping("/pos/{pointOfSaleId}/terminals/add")
    @ResponseStatus(value = HttpStatus.CREATED)
    public Terminal addTerminal(@PathVariable Integer pointOfSaleId, @Valid @RequestBody TerminalDto terminalDto, BindingResult result){
        return terminalService.addTerminal(pointOfSaleId, terminalDto, result);
    }

    @GetMapping("/terminals/{terminalId}")
    @ResponseStatus(value = HttpStatus.OK)
    public TerminalDto getTerminalById(@PathVariable Integer terminalId){
        return terminalService.findById(terminalId);
    }

    @PutMapping("/terminals/{terminalId}/edit")
    @ResponseStatus(value = HttpStatus.OK)
    public Terminal updateTerminal(@PathVariable Integer terminalId, @Valid @RequestBody TerminalDto terminalDto, BindingResult result){
        return terminalService.updateTerminal(terminalId, terminalDto, result);
    }

    @DeleteMapping("/terminals/{terminalId}/delete")
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void deleteTerminal(@PathVariable Integer terminalId){
        terminalService.deleteTerminal(terminalId);
    }

    @GetMapping("/terminals/metadata")
    @ResponseStatus(value = HttpStatus.OK)
    public TerminalMetadata getTerminalMetadata(){
        return terminalService.getTerminalMetadata();
    }

    @GetMapping("/terminals/{terminalId}/generateCredentials")
    @ResponseStatus(value = HttpStatus.OK)
    public void generateCredentials(@PathVariable Integer terminalId){
        terminalService.generateCredentials(terminalId);
    }

    @GetMapping("/terminals/qrcode/{userId}")
    @ResponseStatus(value = HttpStatus.OK)
    public void generateQrCode(@PathVariable String userId, HttpServletResponse response) throws IOException {
        response.setContentType("image/png");
        OutputStream outputStream = response.getOutputStream();
        outputStream.write(ZXingHelper.getQRCodeImage(userId, 200, 200));
        outputStream.flush();
        outputStream.close();
    }

}
