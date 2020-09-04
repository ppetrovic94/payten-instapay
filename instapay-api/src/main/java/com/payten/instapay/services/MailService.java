package com.payten.instapay.services;

import javax.mail.MessagingException;

public interface MailService {
    void sendTerminalCredentialsOnMail(String recepient, String tid, String base64content) throws MessagingException;
}
