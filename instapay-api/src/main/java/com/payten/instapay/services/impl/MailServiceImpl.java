package com.payten.instapay.services.impl;

import com.payten.instapay.services.MailService;
import com.sun.istack.ByteArrayDataSource;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

@Service
public class MailServiceImpl implements MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendTerminalCredentialsOnMail(String recepient, String tid, String base64content) throws MessagingException {

        byte [] pdfContent = null;
        if (Base64.isBase64(base64content)){
            String formatedBase64 = base64content.replaceAll(" ", "+");
            pdfContent = Base64.decodeBase64(formatedBase64);
        }

        MimeMessage message = mailSender.createMimeMessage();
        message.setFrom("payten.mail.sender@gmail.com");
        message.setRecipient(MimeMessage.RecipientType.TO, new InternetAddress(recepient));
        message.setSubject("Kredencijali - " + tid);

        DataSource ds = new ByteArrayDataSource(pdfContent, "application/pdf");
        MimeBodyPart messageBodyPart = new MimeBodyPart();
        messageBodyPart.setDataHandler(new DataHandler(ds));
        messageBodyPart.setFileName(tid + "-kredencijali");

        Multipart mp = new MimeMultipart();
        mp.addBodyPart(messageBodyPart);
        message.setContent(mp);
        System.setProperty("https.protocols", "TLSv1.1");
        mailSender.send(message);
    }
}
