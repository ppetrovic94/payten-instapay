package com.payten.instapay.repositories;

import com.payten.instapay.model.PaymentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRequestRepository extends JpaRepository<PaymentRequest, String>, PagingAndSortingRepository<PaymentRequest, String> {

}
