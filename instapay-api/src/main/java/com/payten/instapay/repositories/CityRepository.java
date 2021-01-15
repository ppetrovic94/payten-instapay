package com.payten.instapay.repositories;

import com.payten.instapay.model.City;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CityRepository extends JpaRepository<City, Integer>, PagingAndSortingRepository<City, Integer> {
        City getByCityId(Integer id);

        City findByCityName(String cityName);

        City getByCityCode(String cityCode);

        Page<City> findAll(Pageable page);
        List<City> findAll();

        Page<City> findByCityNameContaining(String cityName, Pageable page);
        Page<City> findByCityCodeContaining(String cityCode, Pageable page);

        boolean existsByCityName(String cityName);
        boolean existsByCityCode(String cityCode);
}
