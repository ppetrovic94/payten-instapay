package com.payten.instapay.repositories;

import com.payten.instapay.model.AcqUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AcqUserRepository extends JpaRepository<AcqUser, Integer> {

    AcqUser getByMerchant_MerchantId(Integer merchantId);
    AcqUser getByPointOfSale_PointOfSaleId(Integer posId);
    AcqUser getByTerminal_TerminalId(Integer terminalId);
    AcqUser getByUserId(String userId);

    boolean existsByMerchant_MerchantId(Integer merchantId);
    boolean existsByUserId(String userId);

    @Procedure(name = "AcqUser.generateCredentials2")
    void generateCredentials2(@Param("MERCHANT_ID") Integer merchantId,
                              @Param("POS_ID") Integer posId,
                              @Param("TERMINAL_ID") Integer terminalId);


}
