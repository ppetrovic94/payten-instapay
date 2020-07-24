package com.payten.instapay.repositories;

import com.payten.instapay.model.AcqStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AcqStatusRepository extends JpaRepository<AcqStatus, Integer> {
    AcqStatus getAcqStatusByStatusId(Integer id);
    List<AcqStatus> findAll();
}
