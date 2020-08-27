package com.payten.instapay.repositories;

import com.payten.instapay.model.Terminal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
public interface TerminalRepository extends JpaRepository<Terminal, Integer>, PagingAndSortingRepository<Terminal, Integer> {

    Page<Terminal> findAllByPointOfSaleId(Integer pointOfSaleId,Pageable page);
    Terminal getByTerminalId(Integer terminalId);

    Page<Terminal> findByPointOfSaleIdAndAcquirerTidContaining(Integer pointOfSaleId, String acquirerTid, Pageable pageable);
    Page<Terminal> findByPointOfSaleIdAndTerminalAccountContaining(Integer pointOfSaleId, String terminalAccount, Pageable pageable);

    boolean existsByPointOfSaleId(Integer pointOfSaleId);
    boolean existsByAcquirerTid(String acquirerTid);

    @Transactional
    @Procedure(name = "Terminal.generateCredentials")
    void generateCredentials(@Param("TERMINAL_ID") Integer terminalId);

}
