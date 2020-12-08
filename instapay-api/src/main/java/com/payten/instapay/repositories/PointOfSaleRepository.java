package com.payten.instapay.repositories;

import com.payten.instapay.dto.PointOfSale.PointOfSaleNames;
import com.payten.instapay.model.PointOfSale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PointOfSaleRepository extends JpaRepository<PointOfSale, Integer>, PagingAndSortingRepository<PointOfSale, Integer> {

    List<PointOfSale> findAllByPointOfSaleIdAndMerchantId(String pointOfSaleId, Integer merchantId);

    Page<PointOfSale> findAllByMerchantId(Integer merchantId, Pageable page);

    Page<PointOfSale> findByMerchantIdAndPointOfSaleLocalIdContaining(Integer merchantId, String localPointOfSaleId, Pageable page);
    Page<PointOfSale> findByMerchantIdAndPointOfSaleNameContaining(Integer merchantId, String pointOfSaleName, Pageable page);
    Page<PointOfSale> findByMerchantIdAndPointOfSaleAccountContaining(Integer merchantId, String pointOfSaleAcc, Pageable page);
    Page<PointOfSale> findByMerchantIdAndCity_cityNameContaining(Integer merchantId, String cityName, Pageable page);

    PointOfSale getByPointOfSaleId(Integer id);

    @Query("SELECT p.pointOfSaleName FROM PointOfSale p where p.pointOfSaleId = :id")
    String getPointOfSaleNameById(@Param("id") Integer id);

    @Query("SELECT " + " new com.payten.instapay.dto.PointOfSale.PointOfSaleNames(p.pointOfSaleId, p.pointOfSaleName)" + "FROM " + "PointOfSale p " + "where " + "p.merchantId = :merchantId")
    List<PointOfSaleNames> findPointOfSaleIds(@Param("merchantId") Integer merchantId);

    boolean existsByMerchantId(Integer merchantId);
    boolean existsByPointOfSaleLocalId(String pointOfSaleLocalId);

}
