package com.payten.instapay.repositories;

import com.payten.instapay.model.FeeRule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeeRuleRepository extends JpaRepository<FeeRule, Integer>, PagingAndSortingRepository<FeeRule, Integer>, JpaSpecificationExecutor<FeeRule> {

    Page<FeeRule> findAll(Pageable page);
    Page<FeeRule> findAllByMerchant_MerchantId(Integer merchantId, Pageable page);

    FeeRule getByFeeId(Integer feeId);

    Page<FeeRule> findByMerchant_MerchantNameContainingIgnoreCase(String merchantName, Pageable page);
    Page<FeeRule> findByFeeReceiver_ReceiverNameContainingIgnoreCase(String receiverName, Pageable page);
    Page<FeeRule> findByFeeType_TypeNameContainingIgnoreCase(String typeName, Pageable page);
    Page<FeeRule> findByProductType_TypeNameContainingIgnoreCase(String productType, Pageable page);

    boolean existsByMerchant_MerchantId(Integer merchantId);

    Page<FeeRule> findByMerchant_MerchantIdAndMerchant_MerchantNameContainingIgnoreCase(Integer merchantId, String merchantName, Pageable page);
    Page<FeeRule> findByMerchant_MerchantIdAndFeeReceiver_ReceiverNameContainingIgnoreCase(Integer merchantId, String receiverName, Pageable page);
    Page<FeeRule> findByMerchant_MerchantIdAndFeeType_TypeNameContainingIgnoreCase(Integer merchantId, String typeName, Pageable page);
    Page<FeeRule> findByMerchant_MerchantIdAndProductType_TypeNameContainingIgnoreCase(Integer merchantId, String typeName, Pageable page);

}
