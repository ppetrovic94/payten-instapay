package com.payten.instapay.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@NamedStoredProcedureQuery(name = "AcqUser.generateCredentials2",
        procedureName = "GENERATE_CREDENTIALS_2", parameters = {
        @StoredProcedureParameter(mode = ParameterMode.IN, name = "MERCHANT_ID", type = Integer.class),
        @StoredProcedureParameter(mode = ParameterMode.IN, name = "POS_ID", type = Integer.class),
        @StoredProcedureParameter(mode = ParameterMode.IN, name = "TERMINAL_ID", type = Integer.class),
})
@Table(name = "ACQ_USERS")
public class AcqUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ACQ_USER_ID")
    private Integer acqUserId;

    @OneToOne
    @JoinColumn(name = "MERCHANT_ID")
    @JsonIgnoreProperties("acqUser")
    private Merchant merchant;

    @OneToOne
    @JoinColumn(name = "POINT_OF_SALE_ID")
    @JsonIgnoreProperties("acqUser")
    private PointOfSale pointOfSale;

    @OneToOne
    @JoinColumn(name = "TERMINAL_ID")
    @JsonIgnoreProperties("acqUser")
    private Terminal terminal;

    @Column(name = "USER_ID")
    private String userId;

    public AcqUser(){}

    public Integer getAcqUserId() {
        return acqUserId;
    }

    public void setAcqUserId(Integer acqUserId) {
        this.acqUserId = acqUserId;
    }


    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Merchant getMerchant() {
        return merchant;
    }

    public void setMerchant(Merchant merchant) {
        this.merchant = merchant;
    }

    public PointOfSale getPointOfSale() {
        return pointOfSale;
    }

    public void setPointOfSale(PointOfSale pointOfSale) {
        this.pointOfSale = pointOfSale;
    }

    public Terminal getTerminal() {
        return terminal;
    }

    public void setTerminal(Terminal terminal) {
        this.terminal = terminal;
    }
}
