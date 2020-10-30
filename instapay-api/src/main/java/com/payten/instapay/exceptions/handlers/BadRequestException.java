package com.payten.instapay.exceptions.handlers;

public class BadRequestException extends RuntimeException {

    public BadRequestException(String message){
        super(message);
    }

}
