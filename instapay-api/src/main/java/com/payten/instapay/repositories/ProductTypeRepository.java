package com.payten.instapay.repositories;

import com.payten.instapay.model.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductTypeRepository extends JpaRepository<ProductType, Integer> {
    ProductType getByTypeId(Integer typeId);
}
