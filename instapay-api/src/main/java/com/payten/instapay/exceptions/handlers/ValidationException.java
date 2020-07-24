package com.payten.instapay.exceptions.handlers;

import java.util.Map;

public class ValidationException extends RuntimeException {

    private Map<String,String> errorMap;

    public ValidationException(Map<String, String> errorMap) {
        this.errorMap = errorMap;
    }

    public Map<String,String> getErrors(){
        return errorMap;
    }

}
