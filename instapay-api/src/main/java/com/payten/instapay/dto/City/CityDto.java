package com.payten.instapay.dto.City;

import javax.validation.constraints.NotEmpty;

public class CityDto {

    @NotEmpty(message = "Morate uneti ime grada")
    private String cityName;

    @NotEmpty(message = "Morate uneti poštanski broj grada")
    private String cityCode;

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public String getCityCode() {
        return cityCode;
    }

    public void setCityCode(String cityCode) {
        this.cityCode = cityCode;
    }
}
