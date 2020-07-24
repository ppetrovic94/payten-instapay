package com.payten.instapay.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="REG_FEE_RECEIVER")
public class FeeReceiver {


    @Id
    @Column(name="RECEIVER_ID")
    private Integer receiverId;

    @Column(name="RECEIVER_NAME")
    private String receiverName;

    public FeeReceiver() {
    }

    public Integer getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Integer receiverId) {
        this.receiverId = receiverId;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }


}
