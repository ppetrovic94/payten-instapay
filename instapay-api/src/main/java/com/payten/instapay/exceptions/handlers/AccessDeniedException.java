package com.payten.instapay.exceptions.handlers;

public class AccessDeniedException extends RuntimeException {
    public AccessDeniedException(String message){ super(message); }
}
