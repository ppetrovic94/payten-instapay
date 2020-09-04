package com.payten.instapay.dto.PointOfSale;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;

public class PointOfSaleDto {

    private String pointOfSaleLocalId;

    @NotEmpty(message = "Morate uneti naziv prodajnog mesta")
    private String pointOfSaleName;

    @NotEmpty(message = "Morate uneti adresu prodajnog mesta")
    private String pointOfSaleAddress;

    private Integer cityId;

    @NotNull(message = "Morate uneti datum unosa novog prodajnog mesta")
    private String setupDate;

    private String paymentMethodId;

    private String pointOfSaleAccount;

    private String pointOfSaleMcc;

    @NotNull
    private Integer statusId;

    public String getPointOfSaleLocalId() {
        return pointOfSaleLocalId;
    }

    public void setPointOfSaleLocalId(String pointOfSaleLocalId) {
        this.pointOfSaleLocalId = pointOfSaleLocalId;
    }

    public String getPointOfSaleName() {
        return pointOfSaleName;
    }

    public void setPointOfSaleName(String pointOfSaleName) {
        this.pointOfSaleName = pointOfSaleName;
    }

    public String getPointOfSaleAddress() {
        return pointOfSaleAddress;
    }

    public void setPointOfSaleAddress(String pointOfSaleAddress) {
        this.pointOfSaleAddress = pointOfSaleAddress;
    }

    public Date getSetupDate(){
        Date parsedDate = null;
        try {
            java.util.Date formatedDate = new SimpleDateFormat("yyyy-MM-dd").parse(setupDate);
            parsedDate = new Date(formatedDate.getTime());
            return parsedDate;
        } catch(ParseException e){
            e.printStackTrace();
        }
        return parsedDate;
    }

    public void setSetupDate(String setupDate) {
        this.setupDate = setupDate;
    }

    public String getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(String paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public String getPointOfSaleAccount() {
        return pointOfSaleAccount;
    }

    public void setPointOfSaleAccount(String pointOfSaleAccount) {
        this.pointOfSaleAccount = pointOfSaleAccount;
    }

    public Integer getStatusId() {
        return statusId;
    }

    public void setStatusId(Integer statusId) {
        this.statusId = statusId;
    }

    public String getPointOfSaleMcc() {
        return pointOfSaleMcc;
    }

    public void setPointOfSaleMcc(String pointOfSaleMcc) {
        this.pointOfSaleMcc = pointOfSaleMcc;
    }

    public Integer getCityId() {
        return cityId;
    }

    public void setCityId(Integer cityId) {
        this.cityId = cityId;
    }
}
