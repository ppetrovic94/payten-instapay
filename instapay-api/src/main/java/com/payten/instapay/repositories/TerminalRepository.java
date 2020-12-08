package com.payten.instapay.repositories;

import com.payten.instapay.dto.PointOfSale.PointOfSaleNames;
import com.payten.instapay.dto.Terminal.TerminalAcquirerIds;
import com.payten.instapay.model.Status;
import com.payten.instapay.model.Terminal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TerminalRepository extends JpaRepository<Terminal, Integer>, PagingAndSortingRepository<Terminal, Integer> {

    Page<Terminal> findAllByPointOfSaleId(Integer pointOfSaleId,Pageable page);
    Terminal getByTerminalId(Integer terminalId);

    Page<Terminal> findByPointOfSaleIdAndAcquirerTidContaining(Integer pointOfSaleId, String acquirerTid, Pageable pageable);
    Page<Terminal> findByPointOfSaleIdAndTerminalAccountContaining(Integer pointOfSaleId, String terminalAccount, Pageable pageable);

    @Query("SELECT t.acquirerTid FROM Terminal t where t.terminalId = :id")
    String getAcquirerTidById(@Param("id") Integer id);

    @Query("SELECT t.terminalId FROM Terminal t where t.acquirerTid = :acquirerTid")
    Integer getTerminalIdByAcquirerTid(@Param("acquirerTid") String acquirerTid);

    @Modifying
    @Query("update Terminal t set t.status = :status where t.terminalId = :terminalId")
    void updateTerminalStatusToInactive(@Param("terminalId") Integer terminalId, @Param("status") Status status);

    @Query("SELECT " + " new com.payten.instapay.dto.Terminal.TerminalAcquirerIds(t.terminalId, t.acquirerTid)" + "FROM " + "Terminal t " + "where " + "t.pointOfSaleId = :pointOfSaleId")
    List<TerminalAcquirerIds> findTerminalAcquirerIdsByPointOfSaleId(@Param("pointOfSaleId") Integer pointOfSaleId);

    @Query("SELECT " + " new com.payten.instapay.dto.Terminal.TerminalAcquirerIds(t.terminalId, t.acquirerTid)" + "FROM " + "Terminal t")
    List<TerminalAcquirerIds> findTerminalAcquirerIds();

    boolean existsByPointOfSaleId(Integer pointOfSaleId);
    boolean existsByAcquirerTid(String acquirerTid);

    @Procedure(name = "Terminal.generateCredentials")
    void generateCredentials(@Param("I_TERMINAL_ID") Integer terminalId);

}
