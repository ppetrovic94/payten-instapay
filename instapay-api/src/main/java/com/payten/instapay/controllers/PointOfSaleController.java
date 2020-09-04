package com.payten.instapay.controllers;

import com.payten.instapay.dto.PointOfSale.PointOfSaleDto;
import com.payten.instapay.model.PointOfSale;
import com.payten.instapay.services.PointOfSaleService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(path="/api/user",produces = "application/json")
public class PointOfSaleController {

    private final PointOfSaleService pointOfSaleService;

    public PointOfSaleController(PointOfSaleService pointOfSaleService) {
        this.pointOfSaleService = pointOfSaleService;
    }

    @GetMapping("/merchant/{merchantId}/pos")
    @ResponseStatus(value = HttpStatus.OK)
    public Page<PointOfSale> getMerchantPointOfSales(@PathVariable Integer merchantId,
                                                     @RequestParam(name="pagenum",required = false, defaultValue = "0") int pageNumber,
                                                     @RequestParam(name="searchTerm", required = false, defaultValue="") String searchTerm,
                                                     @RequestParam(name ="sortBy", required = false, defaultValue = "") String sortBy,
                                                     @RequestParam(name = "direction", required = false, defaultValue = "ASC") String direction){
        return pointOfSaleService.findAllPointOfSalesForMerchantPaginated(merchantId, pageNumber, searchTerm, sortBy, direction);
    }

    @PostMapping("/merchant/{merchantId}/pos/add")
    @ResponseStatus(value = HttpStatus.CREATED)
    public PointOfSale addPointOfSale(@PathVariable Integer merchantId, @Valid  @RequestBody PointOfSaleDto pointOfSale, BindingResult result){
        return pointOfSaleService.addPointOfSale(pointOfSale, result, merchantId);
    }

    @GetMapping("/pos/{pointOfSaleId}")
    @ResponseStatus(value = HttpStatus.OK)
    public PointOfSaleDto getPointOfSaleById(@PathVariable Integer pointOfSaleId){
        return pointOfSaleService.findById(pointOfSaleId);
    }

    @GetMapping("/pos/{pointOfSaleId}/name")
    @ResponseStatus(value = HttpStatus.OK)
    public String getPointOfSaleNameById(@PathVariable Integer pointOfSaleId){
        return pointOfSaleService.getPointOfSaleNameById(pointOfSaleId);
    }

    @PutMapping("/pos/{pointOfSaleId}/edit")
    @ResponseStatus(value = HttpStatus.OK)
    public PointOfSaleDto updatePointOfSale(@PathVariable Integer pointOfSaleId, @Valid @RequestBody PointOfSaleDto pointOfSale, BindingResult result) {
        return pointOfSaleService.editPointOfSale(pointOfSaleId, pointOfSale, result);
    }

}
