package com.payten.instapay.utils;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

public class ZXingHelper {

    public static byte[] getQRCodeImage(String text, int width, int height)
    {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
            MatrixToImageWriter.writeToStream(bitMatrix, "png", byteArrayOutputStream);
            byteArrayOutputStream.flush();
        } catch (IOException | WriterException e) {
            e.printStackTrace();
        }

        return byteArrayOutputStream.toByteArray();

    }

}
