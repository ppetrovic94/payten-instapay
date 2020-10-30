package com.payten.instapay.model;

import javax.persistence.*;

@Entity
@Table(name="REG_CITIES")
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "CITY_ID")
    private Integer cityId;

    @Column(name = "CITY_NAME")
    private String cityName;

    @Column(name = "CITY_CODE")
    private String cityCode;

    @OneToOne
    @JoinColumn(name = "COUNTRY_ID")
    private Country country;

    public City() {
    }

    public Integer getCityId() {
        return cityId;
    }

    public void setCityId(Integer cityId) {
        this.cityId = cityId;
    }

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

    public Country getCountry() {
        return country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }
}
