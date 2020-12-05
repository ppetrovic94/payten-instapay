package com.payten.instapay.controllers;

import com.payten.instapay.services.CredentialsService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path="/api/user",produces = "application/json")
public class CredentialsController {

    private final CredentialsService credentialsService;

    public CredentialsController(CredentialsService credentialsService) {
        this.credentialsService = credentialsService;
    }

    @GetMapping("/credentials/generate")
    @ResponseStatus(value = HttpStatus.OK)
    public void generateCredentials(@RequestParam(name="merchantId",required = false) Integer merchantId,
                                                @RequestParam(name="posId", required = false) Integer posId,
                                                @RequestParam(name ="terminalId", required = false) Integer terminalId)
    {
        credentialsService.generateCredentials(merchantId, posId, terminalId);
    }

}
