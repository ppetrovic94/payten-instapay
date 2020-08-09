package com.payten.instapay.repositories;

import com.payten.instapay.model.FeeRule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeeRuleRepository extends JpaRepository<FeeRule, Integer>, PagingAndSortingRepository<FeeRule, Integer> {

    Page<FeeRule> findAll(Pageable page);
    Page<FeeRule> findAllByMerchant_MerchantId(Integer merchantId, Pageable page);

    FeeRule getByFeeId(Integer feeId);

    Page<FeeRule> findByMerchant_MerchantNameContaining(String merchantName, Pageable page);
    Page<FeeRule> findByFeeReceiver_ReceiverNameContaining(String receiverName, Pageable page);
    Page<FeeRule> findByFeeType_TypeNameContaining(String typeName, Pageable page);
    Page<FeeRule> findByProductType_TypeNameContaining(String productType, Pageable page);

    Page<FeeRule> findByMerchant_MerchantIdAndMerchant_MerchantNameContaining(Integer merchantId, String merchantName, Pageable page);
    Page<FeeRule> findByMerchant_MerchantIdAndFeeReceiver_ReceiverNameContaining(Integer merchantId, String receiverName, Pageable page);
    Page<FeeRule> findByMerchant_MerchantIdAndFeeType_TypeNameContaining(Integer merchantId, String typeName, Pageable page);
    Page<FeeRule> findByMerchant_MerchantIdAndProductType_TypeNameContaining(Integer merchantId, String typeName, Pageable page);

}
