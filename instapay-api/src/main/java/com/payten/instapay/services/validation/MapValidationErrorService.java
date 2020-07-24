package com.payten.instapay.services.validation;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.Map;

@Service
public class MapValidationErrorService {

    public Map<String, String> validate(BindingResult result) {

        Map<String,String> errorMap = new HashMap<String,String>();

        if(result.hasErrors()){

            for(FieldError error: result.getFieldErrors()){
                errorMap.put(error.getField(), error.getDefaultMessage());
            }
            return errorMap;
        }

        return null;

    }
}