package com.payten.instapay.controllers;

import com.payten.instapay.dto.Merchant.MerchantDto;
import com.payten.instapay.dto.Merchant.MerchantMetadata;
import com.payten.instapay.dto.Merchant.MerchantNames;
import com.payten.instapay.dto.Merchant.MerchantUserId;
import com.payten.instapay.model.AcqUser;
import com.payten.instapay.model.FeeRule;
import com.payten.instapay.model.Merchant;
import com.payten.instapay.services.FeeService;
import com.payten.instapay.services.MerchantService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(path="/api/user",produces = "application/json")
public class MerchantController {

    private final MerchantService merchantService;
    private final FeeService feeService;

    public MerchantController(MerchantService merchantService, FeeService feeService){
        this.merchantService = merchantService;
        this.feeService = feeService;
    }

    @GetMapping("/merchants")
    @ResponseStatus(value = HttpStatus.OK)
    public Page<Merchant> getMerchantsPaginated(@RequestParam(name="pagenum",required = false, defaultValue = "0") int pageNumber,
                                                @RequestParam(name="searchTerm", required = false, defaultValue="") String searchTerm,
                                                @RequestParam(name ="sortBy", required = false, defaultValue = "") String sortBy,
                                                @RequestParam(name = "direction", required = false, defaultValue = "ASC") String direction)
    {
        return merchantService.findAllMerchantsPaginated(pageNumber, searchTerm, sortBy, direction);
    }

    @GetMapping("/merchants/{merchantId}/fees")
    @ResponseStatus(value = HttpStatus.OK)
    public Page<FeeRule> getFeesByMerchantId(@PathVariable Integer merchantId,
                                             @RequestParam(name="pagenum",required = false, defaultValue = "0") int pageNumber,
                                             @RequestParam(name="searchTerm", required = false, defaultValue="") String searchTerm,
                                             @RequestParam(name ="sortBy", required = false, defaultValue = "") String sortBy,
                                             @RequestParam(name = "direction", required = false, defaultValue = "ASC") String direction) {
        return feeService.getFeeRulesByMerchantId(merchantId, pageNumber, searchTerm, sortBy, direction);
    }

    @GetMapping("/merchants/{merchantId}/name")
    @ResponseStatus(value = HttpStatus.OK)
    public String getMerchantNameById(@PathVariable Integer merchantId){
        return merchantService.getMerchantNameById(merchantId);
    }

    @GetMapping("/merchants/{merchantId}/email")
    @ResponseStatus(value = HttpStatus.OK)
    public String getMerchantEmailById(@PathVariable Integer merchantId){
        return merchantService.getMerchantEmailById(merchantId);
    }

    @GetMapping("/merchants/all")
    @ResponseStatus(value = HttpStatus.OK)
    public List<Merchant> getMerchants(){
        return merchantService.findAll();
    }

    @GetMapping("/merchants/{id}")
    @ResponseStatus(value = HttpStatus.OK)
    public MerchantDto getMerchantById(@PathVariable Integer id){
        return merchantService.findById(id);
    }

    @PostMapping("/merchants/add")
    @ResponseStatus(value = HttpStatus.CREATED)
    public Merchant addMerchant(@Valid @RequestBody MerchantDto merchant, BindingResult result) {
        return merchantService.addMerchant(merchant, result);
    }

    @PutMapping("/merchant/{id}/edit")
    @ResponseStatus(value = HttpStatus.OK)
    public MerchantDto updateMerchant(@PathVariable Integer id, @Valid @RequestBody MerchantDto merchant, BindingResult result) {
        return merchantService.editMerchant(id, merchant, result);
    }

    @DeleteMapping("/merchants/{id}/delete")
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void deleteMerchant(@PathVariable Integer id){
        merchantService.deleteMerchant(id);
    }

    @GetMapping("/merchants/metadata")
    @ResponseStatus(value = HttpStatus.OK)
    public MerchantMetadata getMerchantMetadata(){
        return merchantService.getMerchantMetadata();
    }

    @GetMapping("/merchants/names")
    @ResponseStatus(value = HttpStatus.OK)
    public List<MerchantNames> getMerchantNames(){
        return merchantService.getMerchantNames();
    }

    @GetMapping("/merchants/{merchantId}/credentials")
    @ResponseStatus(value = HttpStatus.OK)
    public String getUserId(@PathVariable Integer merchantId){
        return merchantService.getUserIdByMerchantId(merchantId);
    }

    @GetMapping("/merchants/{merchantId}/hasCredentials")
    @ResponseStatus(value = HttpStatus.OK)
    public boolean checkForMerchantCredentials(@PathVariable Integer merchantId){
        return merchantService.checkMerchantCredentialsByMerchantId(merchantId);
    }

    @PostMapping("/merchants/{merchantId}/saveCredentials")
    @ResponseStatus(value = HttpStatus.OK)
    public AcqUser saveMerchantCredentials(@PathVariable Integer merchantId, @RequestBody MerchantUserId merchantCredentials) {
       return merchantService.saveCredentials(merchantId, merchantCredentials.getUserId());
    }

    @PutMapping("/merchants/{merchantId}/updateCredentials")
    @ResponseStatus(value = HttpStatus.OK)
    public AcqUser updateMerchantCredentials(@PathVariable Integer merchantId, @RequestBody MerchantUserId merchantCredentials) {
        return merchantService.updateCredentials(merchantId, merchantCredentials.getUserId());
    }


}
