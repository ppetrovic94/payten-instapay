package com.payten.instapay.repositories;

import com.payten.instapay.model.Merchant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MerchantRepository extends JpaRepository<Merchant, Integer>, PagingAndSortingRepository<Merchant, Integer> {

    List<Merchant> findAll();
    Page<Merchant> findAll(Pageable page);

    Page<Merchant> findByLocalMerchantIdContaining(String localMerchantId, Pageable page);
    Page<Merchant> findByMerchantNameContaining(String merchantName, Pageable page);
    Page<Merchant> findByMerchantAddressContaining(String merchantAddress, Pageable page);
    Page<Merchant> findByPersonalIdentityNumberContaining(String personalIdentityNumber, Pageable page);
    Page<Merchant> findByCity_cityNameContaining(String cityName, Pageable page);

    Merchant getByMerchantId(Integer id);

    boolean existsByLocalMerchantId(String localMerchantId);
    boolean existsByPersonalIdentityNumber(String personalIdentityNumber);
    boolean existsByTaxIdentityNumber(String taxIdentityNumber);

}
