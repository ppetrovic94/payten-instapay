package com.payten.instapay.exceptions;

import com.payten.instapay.exceptions.handlers.RequestedResourceNotFoundException;
import com.payten.instapay.exceptions.handlers.ValidationException;
import com.payten.instapay.exceptions.handlers.ValueAlreadyExistException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.Map;

@ControllerAdvice
@RestController
public class CustomResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(RequestedResourceNotFoundException.class)
    public ResponseEntity<Object> entityNotFound(RequestedResourceNotFoundException ex) {
        RequestedResourceNotFoundException exceptionResponse = new RequestedResourceNotFoundException(ex.getMessage());
        return new ResponseEntity<>(exceptionResponse.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Object> validationFailure(ValidationException exc) {
        Map<String,String> errorMap = exc.getErrors();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorMap);
    }

    @ExceptionHandler
    public final ResponseEntity<Object> handleUniqueConstraints(ValueAlreadyExistException ex){
        ValueAlreadyExistException exceptionResponse = new ValueAlreadyExistException(ex.getMessage());
        return new ResponseEntity<>(exceptionResponse.getMessage(), HttpStatus.BAD_REQUEST);
    }

}
