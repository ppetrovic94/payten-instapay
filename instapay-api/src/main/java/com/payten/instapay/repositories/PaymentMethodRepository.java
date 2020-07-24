package com.payten.instapay.repositories;

import com.payten.instapay.model.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, String> {
    PaymentMethod getByPaymentMethodId(String id);
    List<PaymentMethod> findAll();
}
