package com.payten.instapay.repositories;

import com.payten.instapay.model.AcqUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AcqUserRepository extends JpaRepository<AcqUser, Integer> {

    AcqUser getByMerchant_MerchantId(Integer merchantId);

    boolean existsByMerchant_MerchantId(Integer merchantId);

    @Procedure(name = "AcqUser.generateCredentials3")
    void generateCredentials3(@Param("I_MERCHANT_ID") Integer merchantId,
                              @Param("I_POS_ID") Integer posId,
                              @Param("I_TERMINAL_ID") Integer terminalId);


}
