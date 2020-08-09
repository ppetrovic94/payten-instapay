package com.payten.instapay.repositories;

import com.payten.instapay.model.FeeReceiver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeeReceiverRepository extends JpaRepository<FeeReceiver, Integer> {
    FeeReceiver getByReceiverId(Integer receiverId);
}
