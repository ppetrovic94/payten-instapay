package com.payten.instapay.services;

import com.payten.instapay.dto.City.CityDto;
import com.payten.instapay.model.City;
import org.springframework.data.domain.Page;
import org.springframework.validation.BindingResult;

public interface CityService {
    Page<City> getCities(int pageNumber, String term, String sortBy, String searchTerm);
    City getCityById(Integer cityId);
    City addCity(CityDto cityDto, BindingResult result);
    City updateCity(CityDto cityDto, Integer cityId, BindingResult result);
    void deleteCity(Integer cityId);
}
