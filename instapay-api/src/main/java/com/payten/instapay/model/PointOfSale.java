package com.payten.instapay.model;

import javax.persistence.*;
import java.sql.Date;
import java.util.List;

@Entity
@Table(name="ACQ_POINTS_OF_SALE")
public class PointOfSale {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "POINT_OF_SALE_ID")
    private Integer pointOfSaleId;

    @Column(name = "POINT_OF_SALE_NAME")
    private String pointOfSaleName;

    @Column(name = "POINT_OF_SALE_ADDRESS")
    private String pointOfSaleAddress;

    @OneToOne
    @JoinColumn(name = "POINT_OF_SALE_CITY_ID")
    private City city;

    @Basic
    @Column(name = "POINT_OF_SALE_SETUP_DATE")
    private Date setupDate;

    @OneToOne
    @JoinColumn(name = "POINT_OF_SALE_STATUS")
    private AcqStatus status;

    @Column(name = "MERCHANT_ID")
    private Integer merchantId;

    @Column(name = "POINT_OF_SALE_LOCAL_ID")
    private String pointOfSaleLocalId;

    @OneToOne
    @JoinColumn(name = "DEFAULT_PAYMENT_METHOD")
    private PaymentMethod paymentMethod;

    @Column(name = "POINT_OF_SALE_ACCOUNT")
    private String pointOfSaleAccount;

    @Column(name = "POINT_OF_SALE_MCC")
    private String pointOfSaleMCC;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "pointOfSaleId", cascade = CascadeType.ALL)
    private List<Terminal> terminals;

    public PointOfSale() {
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

    public String getPointOfSaleAddress() {
        return pointOfSaleAddress;
    }

    public void setPointOfSaleAddress(String pointOfSaleAddress) {
        this.pointOfSaleAddress = pointOfSaleAddress;
    }

    public City getCity() {
        return city;
    }

    public void setCity(City city) {
        this.city = city;
    }

    public Date getSetupDate() {
        return setupDate;
    }

    public void setSetupDate(Date setupDate) {
        this.setupDate = setupDate;
    }

    public AcqStatus getStatus() {
        return status;
    }

    public void setStatus(AcqStatus status) {
        this.status = status;
    }

    public Integer getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(Integer merchantId) {
        this.merchantId = merchantId;
    }

    public String getPointOfSaleLocalId() {
        return pointOfSaleLocalId;
    }

    public void setPointOfSaleLocalId(String pointOfSaleLocalId) {
        this.pointOfSaleLocalId = pointOfSaleLocalId;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPointOfSaleAccount() {
        return pointOfSaleAccount;
    }

    public void setPointOfSaleAccount(String pointOfSaleAccount) {
        this.pointOfSaleAccount = pointOfSaleAccount;
    }

    public String getPointOfSaleMCC() {
        return pointOfSaleMCC;
    }

    public void setPointOfSaleMCC(String pointOfSaleMCC) {
        this.pointOfSaleMCC = pointOfSaleMCC;
    }

    public List<Terminal> getTerminals() {
        return terminals;
    }

    public void setTerminals(List<Terminal> terminals) {
        this.terminals = terminals;
    }
}
