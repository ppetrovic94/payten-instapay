package com.payten.instapay.repositories;

import com.payten.instapay.model.TerminalType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TerminalTypeRepository extends JpaRepository<TerminalType, Integer> {
    TerminalType getByTerminalTypeId(Integer id);
    TerminalType getByTerminalTypeName(String typeName);
}
