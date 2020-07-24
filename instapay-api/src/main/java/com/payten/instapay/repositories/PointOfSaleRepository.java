package com.payten.instapay.repositories;

import com.payten.instapay.model.PointOfSale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PointOfSaleRepository extends JpaRepository<PointOfSale, Integer>, PagingAndSortingRepository<PointOfSale, Integer> {
    Page<PointOfSale> findAllByMerchantId(Integer merchantId, Pageable page);

    Page<PointOfSale> findByPointOfSaleLocalIdContaining(String localPointOfSaleId, Pageable page);
    Page<PointOfSale> findByPointOfSaleNameContaining(String pointOfSaleName, Pageable page);
    Page<PointOfSale> findByPointOfSaleAccountContaining(String pointOfSaleAcc, Pageable page);
    Page<PointOfSale> findByCity_cityNameContaining(String cityName, Pageable page);

    PointOfSale getByPointOfSaleId(Integer id);

    boolean existsByPointOfSaleLocalId(String pointOfSaleLocalId);

}
