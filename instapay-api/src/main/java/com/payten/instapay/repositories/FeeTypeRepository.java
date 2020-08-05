package com.payten.instapay.repositories;

import com.payten.instapay.model.FeeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeeTypeRepository extends JpaRepository<FeeType, Integer>, PagingAndSortingRepository<FeeType, Integer> {
}
