package com.payten.instapay.repositories;

import com.payten.instapay.model.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatusRepository extends JpaRepository<Status, Integer> {
    Status getStatusByStatusId(Integer id);
    Status getStatusByStatusName(String statusName);
    List<Status> findAll();
}
