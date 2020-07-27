package com.payten.instapay.controllers;

import com.payten.instapay.dto.City.CityDto;
import com.payten.instapay.model.City;
import com.payten.instapay.model.Country;
import com.payten.instapay.services.CityService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(path="/user",produces = "application/json")
@CrossOrigin(origins="*")
public class CityController {

    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @GetMapping("/cities")
    @ResponseStatus(value = HttpStatus.OK)
    public Page<City> getCities(@RequestParam(name="pagenum",required = false, defaultValue = "0") int pageNumber,
                                @RequestParam(name="searchTerm", required = false, defaultValue="") String searchTerm){
        return cityService.getCities(pageNumber, searchTerm);
    }

    @GetMapping("/cities/{cityId}")
    @ResponseStatus(value = HttpStatus.OK)
    public City getCityById(@PathVariable Integer cityId){
        return cityService.getCityById(cityId);
    }

    @PostMapping("/cities/add")
    @ResponseStatus(value = HttpStatus.CREATED)
    public City addCity(@Valid @RequestBody CityDto cityDto, BindingResult result){
        return cityService.addCity(cityDto, result);
    }

    @PutMapping("/cities/{cityId}/update")
    @ResponseStatus(value = HttpStatus.OK)
    public City updateCity(@PathVariable Integer cityId, @Valid @RequestBody CityDto cityDto, BindingResult result){
        return cityService.updateCity(cityDto, cityId, result);
    }

    @DeleteMapping("/cities/{cityId}/delete")
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void deleteCity(@PathVariable Integer cityId) {
        cityService.deleteCity(cityId);
    }

}
