package com.payten.instapay.dto.PointOfSale;

public class PointOfSaleNames {

    private Integer pointOfSaleId;
    private String pointOfSaleName;

    public PointOfSaleNames() {}

    public PointOfSaleNames(Integer pointOfSaleId, String pointOfSaleName) {
        this.pointOfSaleId = pointOfSaleId;
        this.pointOfSaleName = pointOfSaleName;
    }

    public Integer getPointOfSaleId() {
        return pointOfSaleId;
    }

    public void setPointOfSaleId(Integer pointOfSaleId) {
        this.pointOfSaleId = pointOfSaleId;
    }

    public String getPointOfSaleName() {
        return pointOfSaleName;
    }

    public void setPointOfSaleName(String pointOfSaleName) {
        this.pointOfSaleName = pointOfSaleName;
    }
}
