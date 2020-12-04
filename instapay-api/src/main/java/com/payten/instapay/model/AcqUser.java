package com.payten.instapay.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@NamedStoredProcedureQuery(name = "AcqUser.generateCredentials3",
        procedureName = "GENERATE_CREDENTIALS_3", parameters = {
        @StoredProcedureParameter(mode = ParameterMode.IN, name = "I_MERCHANT_ID", type = Integer.class),
        @StoredProcedureParameter(mode = ParameterMode.IN, name = "I_POS_ID", type = Integer.class),
        @StoredProcedureParameter(mode = ParameterMode.IN, name = "I_TERMINAL_ID", type = Integer.class),
})
@Table(name = "ACQ_USERS")
public class AcqUser {

    @Id
    @GeneratedValue(generator="increment")
    @GenericGenerator(name="increment", strategy = "increment")
    @Column(name = "ACQ_USER_ID")
    private Integer acqUserId;

    @OneToOne
    @JoinColumn(name = "MERCHANT_ID")
    @JsonIgnoreProperties("acqUser")
    private Merchant merchant;

    @Column(name = "POINT_OF_SALE_ID")
    private Integer pointOfSaleId;

    @JoinColumn(name = "TERMINAL_ID")
    private Integer terminalId;

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

    public Integer getPointOfSaleId() {
        return pointOfSaleId;
    }

    public void setPointOfSaleId(Integer pointOfSaleId) {
        this.pointOfSaleId = pointOfSaleId;
    }

    public Integer getTerminalId() {
        return terminalId;
    }

    public void setTerminalId(Integer terminalId) {
        this.terminalId = terminalId;
    }

    public Merchant getMerchant() {
        return merchant;
    }

    public void setMerchant(Merchant merchant) {
        this.merchant = merchant;
    }
}
