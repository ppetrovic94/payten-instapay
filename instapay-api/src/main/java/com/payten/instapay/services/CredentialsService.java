package com.payten.instapay.services;


public interface CredentialsService {

    void generateCredentials(Integer merchantId, Integer posId, Integer terminalId);

}
