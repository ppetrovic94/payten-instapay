package com.payten.instapay.repositories;

import com.payten.instapay.model.FeeRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeeRuleRepository extends JpaRepository<FeeRule, Integer>, PagingAndSortingRepository<FeeRule, Integer> {

}
