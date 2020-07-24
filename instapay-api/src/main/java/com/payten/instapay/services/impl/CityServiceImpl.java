package com.payten.instapay.services.impl;

import com.payten.instapay.dto.City.CityDto;
import com.payten.instapay.exceptions.handlers.RequestedResourceNotFoundException;
import com.payten.instapay.exceptions.handlers.ValidationException;
import com.payten.instapay.model.City;
import com.payten.instapay.repositories.CityRepository;
import com.payten.instapay.repositories.CountryRepository;
import com.payten.instapay.services.CityService;
import com.payten.instapay.services.validation.MapValidationErrorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.util.HashMap;
import java.util.Map;

@Service
public class CityServiceImpl implements CityService {

    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;
    private final MapValidationErrorService mapValidationErrorService;

    public CityServiceImpl(CityRepository cityRepository, CountryRepository countryRepository, MapValidationErrorService mapValidationErrorService) {
        this.cityRepository = cityRepository;
        this.countryRepository = countryRepository;
        this.mapValidationErrorService = mapValidationErrorService;
    }

    @Override
    public Page<City> getCities(int pageNumber, String searchTerm) {
        Pageable page = PageRequest.of(pageNumber, 25, Sort.by("cityId"));
        Page<City> cities = null;

        if (searchTerm.isEmpty()) {
            cities = cityRepository.findAll(page);
            return cities;
        }

        cities = searchByTerm(searchTerm, page);
        return cities;
    }

    @Override
    public City getCityById(Integer cityId) {
        City city = cityRepository.getByCityId(cityId);
        if (city == null) throw new RequestedResourceNotFoundException("Grad sa ID-em: " + cityId + " ne postoji");
        return city;
    }

    @Override
    public City addCity(CityDto cityDto, BindingResult result) {
        Map<String,String> errorMap = mapValidationErrorService.validate(result);

        if (errorMap != null) {
            throw new ValidationException(errorMap);
        } else {
            errorMap = checkCityUniqueConstraints(cityDto.getCityName(), cityDto.getCityCode(), null);
            if (errorMap != null) {
                throw new ValidationException(errorMap);
            }
        }

        City city = new City();
        city.setCityName(cityDto.getCityName());
        city.setCityCode(cityDto.getCityCode());
        city.setCountry(countryRepository.getByCountryName("Srbija"));

        return city;
    }



    @Override
    public City updateCity(CityDto cityDto, Integer cityId, BindingResult result) {
        City found = cityRepository.getByCityId(cityId);

        if (found == null) throw new RequestedResourceNotFoundException("Grad sa ID-em: " + cityId + " ne postoji");

        Map<String,String> errorMap = mapValidationErrorService.validate(result);

        if (errorMap != null) {
            throw new ValidationException(errorMap);
        } else {
            errorMap = checkCityUniqueConstraints(cityDto.getCityName(), cityDto.getCityCode(), found);
            if (errorMap != null) {
                throw new ValidationException(errorMap);
            }
        }

        found.setCityName(cityDto.getCityName());
        found.setCityCode(cityDto.getCityCode());

        return found;
    }

    @Override
    public void deleteCity(Integer cityId) {
        City found = cityRepository.getByCityId(cityId);

        if (found == null) throw new RequestedResourceNotFoundException("Grad sa ID-em: " + cityId + " ne postoji");

        cityRepository.delete(found);
    }

    Page<City> searchByTerm(String searchTerm, Pageable page){
        Page<City> filtered;

        filtered = cityRepository.findByCityNameContaining(searchTerm, page);
        if (!filtered.getContent().isEmpty()) return filtered;
        filtered = cityRepository.findByCityCodeContaining(searchTerm, page);
        if (!filtered.getContent().isEmpty()) return filtered;

        return filtered;
    }

    private Map<String, String> checkCityUniqueConstraints(String cityName, String cityCode, City city) {
        Map<String, String> errorMap;

        if (city != null && city.getCityName().equals(cityName)) {
            errorMap = null;
        } else {
            if (cityRepository.existsByCityName(cityName)) {
                errorMap = new HashMap<>();
                errorMap.put("cityName", "Grad sa unetim nazivom: " + cityName + " već postoji u bazi");
                return errorMap;
            }
        }

        if (city != null && city.getCityCode().equals(cityCode)){
            errorMap = null;
        }else {
            if (cityRepository.existsByCityCode(cityCode)) {
                errorMap = new HashMap<>();
                errorMap.put("cityCode", "Grad sa unetim poštanskim brojem: " + cityCode + " već postoji u bazi");
                return errorMap;
            }
        }

        return null;
    }

}
