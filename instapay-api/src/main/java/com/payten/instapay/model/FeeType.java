package com.payten.instapay.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="REG_FEE_TYPE")
public class FeeType {
    @Id
    @Column(name="REG_FEE_TYPE_ID")
    private Integer typeId;

    @Column(name="REG_FEE_TYPE_NAME")
    private String typeName;

    public FeeType() {
    }

    public Integer getTypeId() {
        return typeId;
    }

    public void setTypeId(Integer typeId) {
        this.typeId = typeId;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

}
