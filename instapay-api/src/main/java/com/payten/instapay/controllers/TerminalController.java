package com.payten.instapay.controllers;

import com.payten.instapay.dto.Terminal.TerminalDto;
import com.payten.instapay.dto.Terminal.TerminalMetadata;
import com.payten.instapay.model.Terminal;
import com.payten.instapay.model.custom.TerminalTransactionDetails;
import com.payten.instapay.model.custom.TerminalTransactionPage;
import com.payten.instapay.services.MailService;
import com.payten.instapay.services.TerminalService;
import com.payten.instapay.services.TransactionService;
import com.payten.instapay.utils.ZXingHelper;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

@RestController
@RequestMapping(path="/api/user",produces = "application/json")
public class TerminalController {

    private final TerminalService terminalService;
    private final TransactionService transactionService;
    private final MailService mailService;

    public TerminalController(TerminalService terminalService, TransactionService transactionService, MailService mailService) {
        this.terminalService = terminalService;
        this.transactionService = transactionService;
        this.mailService = mailService;
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
    public TerminalDto getTerminalDtoById(@PathVariable Integer terminalId){
        return terminalService.findDtoById(terminalId);
    }

    @GetMapping("/terminals/{terminalId}/details")
    @ResponseStatus(value = HttpStatus.OK)
    public Terminal getTerminalById(@PathVariable Integer terminalId){
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

    @GetMapping("/terminals/{terminalId}/acquirerTid")
    @ResponseStatus(value = HttpStatus.OK)
    public String getAcquirerIdById(@PathVariable Integer terminalId){
        return terminalService.getAcquirerTidById(terminalId);
    }

    @GetMapping("/terminals/{acquirerTid}/generateCredentials")
    @ResponseStatus(value = HttpStatus.OK)
    public void generateCredentials(@PathVariable String acquirerTid,
                                    @RequestParam(name="regenerate",required = false, defaultValue = "false") boolean regenerate){
        terminalService.generateCredentials(acquirerTid, regenerate);
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

    @GetMapping("/terminals/{terminalId}/transactions")
    @ResponseStatus(value = HttpStatus.OK)
    public TerminalTransactionPage getTransactionByTerminalIdAndDateRangePaginated(@PathVariable String terminalId,
                                                                                   @RequestParam(name="dateFrom") String dateFrom,
                                                                                   @RequestParam(name="dateTo") String dateTo,
                                                                                   @RequestParam(name ="pageNum") Integer pageNum,
                                                                                   @RequestParam(name ="pageSize") Integer pageSize){
        return transactionService.getTransactionByTerminalIdAndDateRangePaginated(dateFrom,dateTo, terminalId, pageNum, pageSize);
    }

    @GetMapping("/terminals/transactions/{endToEndId}")
    @ResponseStatus(value = HttpStatus.OK)
    public List<TerminalTransactionDetails> getTransactionDetailsByEndToEndId(@PathVariable String endToEndId){
        return transactionService.getTransactionDetailsByEndToEndId(endToEndId);
    }

    @GetMapping("/terminals/credentials/send")
    @ResponseStatus(value = HttpStatus.OK)
    public void sendCredentials(@RequestParam(name="sendTo") String sendTo, @RequestParam(name="terminalId") String terminalId, @RequestParam(name="pdfFileBase64") String base64content) throws MessagingException {
        mailService.sendTerminalCredentialsOnMail(sendTo, terminalId, base64content);
    }

}
