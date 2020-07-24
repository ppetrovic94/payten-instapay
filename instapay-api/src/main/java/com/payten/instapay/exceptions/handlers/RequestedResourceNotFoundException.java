package com.payten.instapay.exceptions.handlers;

public class RequestedResourceNotFoundException extends RuntimeException {

    public RequestedResourceNotFoundException(String message){
        super(message);
    }

}
