package com.payten.instapay.exceptions.handlers;

public class ValueAlreadyExistException extends RuntimeException {

    public ValueAlreadyExistException(String message){
        super(message);
    }

}
