package com.payten.instapay.controllers;

import com.payten.instapay.dto.Fee.FeeMetadata;
import com.payten.instapay.dto.Fee.FeeRuleDto;
import com.payten.instapay.model.FeeRule;
import com.payten.instapay.services.FeeService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(path="/api/user",produces = "application/json")
public class FeeController {

    private final FeeService feeService;

    public FeeController(FeeService feeService) {
        this.feeService = feeService;
    }

    @GetMapping("/fees")
    @ResponseStatus(value = HttpStatus.OK)
    public Page<FeeRule> getFeeRules(@RequestParam(name="pagenum",required = false, defaultValue = "0") int pageNumber,
                                     @RequestParam(name="searchTerm", required = false, defaultValue="") String searchTerm){
        return feeService.getFeeRules(pageNumber, searchTerm);
    }

    @GetMapping("/fees/{feeRuleId}")
    @ResponseStatus(value = HttpStatus.OK)
    public FeeRuleDto getFeeRule(@PathVariable Integer feeRuleId){
        return feeService.getFeeRule(feeRuleId);
    }

    @PostMapping("/fees/add")
    @ResponseStatus(value = HttpStatus.CREATED)
    public FeeRule addFeeRule(@Valid @RequestBody FeeRuleDto feeRuleDto, BindingResult result){
        return feeService.addFeeRule(feeRuleDto, result);
    }

    @PutMapping("/fees/{feeRuleId}/update")
    @ResponseStatus(value = HttpStatus.OK)
    public FeeRule updateFeeRule(@PathVariable Integer feeRuleId, @Valid @RequestBody FeeRuleDto feeRuleDto, BindingResult result){
        return feeService.updateFeeRule(feeRuleId, feeRuleDto, result);
    }

    @DeleteMapping("/fees/{feeRuleId}/delete")
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void deleteFeeRule(@PathVariable Integer feeRuleId)
    {
        feeService.deleteFeeRule(feeRuleId);
    }

    @GetMapping("/fees/metadata")
    @ResponseStatus(value = HttpStatus.OK)
    public FeeMetadata getFeeMetadata(){
        return feeService.getFeeMetadata();
    }

}
